# Hash Cracker CLI

Node.js CLI tool to detect hash format and crack hashes using John the Ripper.

## Prerequisites

1. **Install Node.js**  
   Download and install from [https://nodejs.org/](https://nodejs.org/)

2. **Download John the Ripper (Windows)**  
   - Download from [Openwall John the Ripper](https://www.openwall.com/john/)
   - Extract the zip and copy the entire `run` folder into your project

3. **download rockyou.txt**  
   - download rockyou.txt from rockyou.com

4. **Prepare the wordlist**  
   - Use `rockyou.txt` or any other wordlist and place it in the `run` folder

---

## Usage

### 1. Prepare `hash.txt`

- Put the hash you want to crack in `run/hash.txt`  
  Example: `5f4dcc3b5aa765d61d8327deb882cf99`

### 2. Run the tool

```bash
node src/index.js <hash>
```

### 3. View results

- Check `run/hash.txt` for cracked hashes
