# Author:: Donald Stufft (<donald@stufft.io>)
# Copyright:: Copyright (c) 2013 Donald Stufft
# License:: Apache License, Version 2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
from __future__ import absolute_import
from __future__ import division

import hmac
import os
import warnings

from .__about__ import (
    __author__,
    __copyright__,
    __email__,
    __license__,
    __summary__,
    __title__,
    __uri__,
    __version__,
)
from . import _bcrypt  # noqa: I100


__all__ = [
    "__title__",
    "__summary__",
    "__uri__",
    "__version__",
    "__author__",
    "__email__",
    "__license__",
    "__copyright__",
    "gensalt",
    "hashpw",
    "kdf",
    "checkpw",
]


def gensalt(rounds: int = 12, prefix: bytes = b"2b") -> bytes:
    if prefix not in (b"2a", b"2b"):
        raise ValueError("Supported prefixes are b'2a' or b'2b'")

    if rounds < 4 or rounds > 31:
        raise ValueError("Invalid rounds")

    salt = os.urandom(16)
    output = _bcrypt.encode_base64(salt)

    return (
        b"$"
        + prefix
        + b"$"
        + ("%2.2u" % rounds).encode("ascii")
        + b"$"
        + output
    )


def hashpw(password: bytes, salt: bytes) -> bytes:
    if isinstance(password, str) or isinstance(salt, str):
        raise TypeError("Strings must be encoded before hashing")

    # bcrypt originally suffered from a wraparound bug:
    # http://www.openwall.com/lists/oss-security/2012/01/02/4
    # This bug was corrected in the OpenBSD source by truncating inputs to 72
    # bytes on the updated prefix $2b$, but leaving $2a$ unchanged for
    # compatibility. However, pyca/bcrypt 2.0.0 *did* correctly truncate inputs
    # on $2a$, so we do it here to preserve compatibility with 2.0.0
    password = password[:72]

    return _bcrypt.hashpass(password, salt)


def checkpw(password: bytes, hashed_password: bytes) -> bool:
    if isinstance(password, str) or isinstance(hashed_password, str):
        raise TypeError("Strings must be encoded before checking")

    ret = hashpw(password, hashed_password)
    return hmac.compare_digest(ret, hashed_password)


def kdf(
    password: bytes,
    salt: bytes,
    desired_key_bytes: int,
    rounds: int,
    ignore_few_rounds: bool = False,
) -> bytes:
    if isinstance(password, str) or isinstance(salt, str):
        raise TypeError("Strings must be encoded before hashing")

    if len(password) == 0 or len(salt) == 0:
        raise ValueError("password and salt must not be empty")

    if desired_key_bytes <= 0 or desired_key_bytes > 512:
        raise ValueError("desired_key_bytes must be 1-512")

    if rounds < 1:
        raise ValueError("rounds must be 1 or more")

    if rounds < 50 and not ignore_few_rounds:
        # They probably think bcrypt.kdf()'s rounds parameter is logarithmic,
        # expecting this value to be slow enough (it probably would be if this
        # were bcrypt). Emit a warning.
        warnings.warn(
            (
                "Warning: bcrypt.kdf() called with only {0} round(s). "
                "This few is not secure: the parameter is linear, like PBKDF2."
            ).format(rounds),
            UserWarning,
            stacklevel=2,
        )

    return _bcrypt.pbkdf(password, salt, rounds, desired_key_bytes)
