import { execSync } from 'child_process';
import { writeFileSync, existsSync, unlinkSync, readFileSync } from 'fs';
import { detectHashType } from './detectFormat.js';

const hashInput = process.argv[2];
if (!hashInput) {
  console.error('กรุณาระบุ hash ที่ต้องการ crack เช่น: node src/index.js 5d41402abc4b2a76b9719d911017c592');
  process.exit(1);
}

const formatMap = {
  'MD5 or NTLM': 'raw-md5',
  'bcrypt': 'bcrypt',
  'Argon2': 'argon2',
  'PBKDF2': 'pbkdf2',
  'Django SHA1': 'raw-sha1',
  'WordPress SHA1': 'raw-sha1',
  'SHA512 crypt (Unix)': 'sha512crypt',
  'SHA256 crypt (Unix)': 'sha256crypt',
  'MD5 crypt (Unix)': 'md5crypt',
  'Apache MD5': 'md5crypt',
  'LDAP SSHA (Base64)': 'ssha',
  'LDAP SHA-1 (Base64)': 'sha1',
  'NT Hash (JOOMLA)': 'nt',
  'NetNTLMv1': 'netntlmv1',
  'NetNTLMv2': 'netntlmv2',
  'LM Hash': 'lm',
  'SHA1': 'raw-sha1',
  'SHA256': 'raw-sha256',
  'SHA384': 'raw-sha384',
  'SHA512': 'raw-sha512',
  'Sun MD5 crypt': 'md5crypt',
  'scrypt': 'scrypt',
  'scrypt (alt)': 'scrypt',
  'MyBB md5(md5($pass).$salt)': 'mybb',
};

const detected = detectHashType(hashInput);
console.log(` Hash: ${hashInput}`);
console.log(` ตรวจเจอเป็น: ${detected}`);

if (detected == 'Base64-encoded (likely SHA or token)' || detected == 'Base64 URL-safe (JWT or token)' || detected == 'JWT Token (Base64 URL)') {
  const decoded = Buffer.from(hashInput, 'base64').toString('utf-8');
  console.log(`  ผลลัพธ์ Base64 decode: ${decoded}`);
  process.exit(0);
}
if (detected == 'Hex encoded string') {
  const decoded = Buffer.from(hashInput, 'hex').toString('utf-8');
  console.log(`  ผลลัพธ์ Hex decode: ${decoded}`);
  process.exit(0);
}
else{
const johnFormat = formatMap[detected];
if (!johnFormat) {
  console.error(` ไม่รองรับการ crack ด้วย john แบบอัตโนมัติสำหรับประเภทนี้: ${detected}`);
  process.exit(1);
}

writeFileSync('hash.txt', hashInput + '\n');

const johnPath = 'john.exe'; // เพราะ cwd: './run' แล้ว
const hashFile = 'hash.txt';
const wordlistPath = 'rockyou.txt';

console.log(' เริ่ม crack ด้วย john the ripper...');
try {
  execSync(
    `"${johnPath}" --format=${johnFormat} --wordlist=${wordlistPath} ${hashFile}`,
    { stdio: 'inherit', cwd: './run' }
  );
  const output = execSync(
    `"${johnPath}" --show --format=${johnFormat} ${hashFile}`,
    { cwd: './run' }
  ).toString();
  console.log('\n✅ ผลลัพธ์ crack hash:');
  console.log(output);
} catch (err) {
  console.error('❌ John ล้มเหลว (exit code 1)\n');
}

const potFile = '../run/john.pot'; // หรือปรับ path ให้ตรงกับที่ไฟล์อยู่จริง

console.log('\n=== DEBUG: john.pot content ===');
if (existsSync(potFile)) {
    console.log(readFileSync(potFile, 'utf-8'));
} else {
    console.log('john.pot ไม่ถูกสร้างหรือยังไม่มีข้อมูล');
}
}