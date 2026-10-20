"""Deterministic JSON serialization and SHA-256 content checksums."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections.abc import Iterable
from pathlib import Path
from typing import Any, NoReturn

CHECKSUM_PREFIX = "sha256:"
DEFAULT_EXCLUDED_ROOT_KEYS = frozenset({"checksum"})


class DuplicateKeyError(ValueError):
    """Raised when a JSON object contains the same key more than once."""


def _reject_duplicate_keys(pairs: Iterable[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise DuplicateKeyError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _reject_non_finite(value: str) -> NoReturn:
    raise ValueError(f"non-finite JSON number is not allowed: {value}")


def loads_json(text: str) -> Any:
    return json.loads(
        text,
        object_pairs_hook=_reject_duplicate_keys,
        parse_constant=_reject_non_finite,
    )


def load_json(path: Path) -> Any:
    return loads_json(path.read_text(encoding="utf-8"))


def _normalize_json_value(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _normalize_json_value(child) for key, child in value.items()}
    if isinstance(value, list):
        return [_normalize_json_value(child) for child in value]
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def canonical_value(
    value: Any,
    *,
    excluded_root_keys: frozenset[str] = DEFAULT_EXCLUDED_ROOT_KEYS,
) -> Any:
    if not isinstance(value, dict):
        return _normalize_json_value(value)
    return {
        key: _normalize_json_value(child)
        for key, child in value.items()
        if key not in excluded_root_keys
    }


def canonical_bytes(
    value: Any,
    *,
    excluded_root_keys: frozenset[str] = DEFAULT_EXCLUDED_ROOT_KEYS,
) -> bytes:
    payload = canonical_value(value, excluded_root_keys=excluded_root_keys)
    serialized = json.dumps(
        payload,
        ensure_ascii=False,
        allow_nan=False,
        separators=(",", ":"),
        sort_keys=True,
    )
    return serialized.encode("utf-8")


def content_checksum(
    value: Any,
    *,
    excluded_root_keys: frozenset[str] = DEFAULT_EXCLUDED_ROOT_KEYS,
) -> str:
    digest = hashlib.sha256(
        canonical_bytes(value, excluded_root_keys=excluded_root_keys)
    ).hexdigest()
    return f"{CHECKSUM_PREFIX}{digest}"


def verify_checksum(value: Any, *, checksum_key: str = "checksum") -> tuple[bool, str, str]:
    if not isinstance(value, dict):
        raise TypeError("checksum verification requires a JSON object")
    expected = value.get(checksum_key)
    if not isinstance(expected, str):
        raise ValueError(f"missing or non-string checksum field: {checksum_key}")
    actual = content_checksum(value, excluded_root_keys=frozenset({checksum_key}))
    return expected == actual, expected, actual


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    checksum_parser = subparsers.add_parser("checksum", help="print the canonical checksum")
    checksum_parser.add_argument("path", type=Path)

    verify_parser = subparsers.add_parser("verify", help="verify the document checksum field")
    verify_parser.add_argument("path", type=Path)

    canonical_parser = subparsers.add_parser("canonical", help="print canonical JSON")
    canonical_parser.add_argument("path", type=Path)
    return parser


def main() -> int:
    args = _build_parser().parse_args()
    try:
        value = load_json(args.path)
        if args.command == "checksum":
            print(content_checksum(value))
            return 0
        if args.command == "canonical":
            print(canonical_bytes(value).decode("utf-8"))
            return 0

        valid, expected, actual = verify_checksum(value)
        if valid:
            print(f"Canonical checksum verified: {actual}  {args.path}")
            return 0
        print(f"Canonical checksum mismatch: expected={expected} actual={actual}  {args.path}")
        return 1
    except (OSError, TypeError, ValueError, json.JSONDecodeError) as exc:
        print(f"FAIL canonical JSON: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
