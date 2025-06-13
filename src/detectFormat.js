function detectHashType(hash) {
    const length = hash.length;

    const patterns = [
        { regex: /^\$2[aby]?\$\d{2}\$.{53}$/, type: 'bcrypt' },
        { regex: /^\$argon2(id|i|d)\$.*$/, type: 'Argon2' },
        { regex: /^\$pbkdf2-.+\$.*$/, type: 'PBKDF2' },
        { regex: /^sha1\$[a-z0-9]+\$.+$/, type: 'Django SHA1' },
        { regex: /^\$sha1\$.*$/, type: 'WordPress SHA1' },
        { regex: /^\$6\$.+$/, type: 'SHA512 crypt (Unix)' },
        { regex: /^\$5\$.+$/, type: 'SHA256 crypt (Unix)' },
        { regex: /^\$1\$.+$/, type: 'MD5 crypt (Unix)' },
        { regex: /^\$apr1\$.+$/, type: 'Apache MD5' },
        { regex: /^\{SSHA\}.+$/, type: 'LDAP SSHA (Base64)' },
        { regex: /^\{SHA\}.+$/, type: 'LDAP SHA-1 (Base64)' },
        { regex: /^\$nt\$.+$/, type: 'NT Hash (JOOMLA)' },
        { regex: /^([a-f0-9]{32}):([a-f0-9]{32})$/i, type: 'NetNTLMv1' },
        { regex: /^([a-f0-9]{32}):([a-f0-9]{32}):([a-f0-9]{32})$/i, type: 'NetNTLMv2' },
        { regex: /^([a-f0-9]{16})$/i, type: 'LM Hash' },
        { regex: /^([a-f0-9]{32})$/i, type: 'MD5 or NTLM' },
        { regex: /^([a-f0-9]{40})$/i, type: 'SHA1' },
        { regex: /^([a-f0-9]{64})$/i, type: 'SHA256' },
        { regex: /^([a-f0-9]{96})$/i, type: 'SHA384' },
        { regex: /^([a-f0-9]{128})$/i, type: 'SHA512' },
        { regex: /^\$md5\$\d+\$.+$/, type: 'Sun MD5 crypt' },
        { regex: /^\$scrypt\$.*$/, type: 'scrypt' },
        { regex: /^\$SCRYPT\$.*$/, type: 'scrypt (alt)' },
        { regex: /^\$ml\$.*$/, type: 'MyBB md5(md5($pass).$salt)' },
        { regex: /^v=[0-9]\|.+\|.+$/, type: 'Windows DPAPI blob' },
        {
            regex: /^[a-fA-F0-9]+$/,
            type: 'Hex encoded string',
        },
        { regex: /^[A-Za-z0-9+\/=]{20,}$/, type: 'Base64-encoded (likely SHA or token)' },
        { regex: /^[A-Za-z0-9_\-]{20,}$/, type: 'Base64 URL-safe (JWT or token)' },
        { regex: /^[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+$/, type: 'JWT Token (Base64 URL)' },
    ];

    for (const pattern of patterns) {
        if (pattern.regex.test(hash)) return pattern.type;
    }

    return 'Unknown';
}

export { detectHashType };
