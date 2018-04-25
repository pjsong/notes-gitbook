# sshKeygen

指令参数：

+ 一次生成指令 `ssh-keygen -t rsa -b 4096 -f ~/.ssh/testsshkeygen -q -N ""`
+ 拷贝生成的publickey到指定机器的authorizedKeys`ssh-copy-id -i ~/.ssh/testsshkeygen user@host`
+ 拷贝的另一种方法`cat ~/.ssh/id_rsa.pub | ssh demo@198.51.100.0 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >>  ~/.ssh/authorized_keys"`
+ ssh-server禁止密码登录`nano /etc/ssh/sshd_config`， `PermitRootLogin without-password`， `sudo systemctl reload sshd.service`

## 参数

+ `-b` “Bits”number of bits in the key.In general, 2048 bits is considered to be sufficient for RSA keys.
+ `-e` “Export” reformatting of existing keys between the OpenSSH key file format and the format documented in RFC 4716, “SSH Public Key File Format”.
+ `-p` “Change the passphrase” change the passphrase of a private key file with [-P old_passphrase] and [-N new_passphrase], [-f keyfile].
+ `-t` “Type” type of key to be created. rsa，dsa，ecdsa
+ `-i` "Input" When ssh-keygen is required to access an existing key, this option designates the file.
+ `-f` "File" Specifies name of the file in which to store the created key.
+ `-N` "New" Provides a new passphrase for the key.
+ `-P` "Passphrase" Provides the (old) passphrase when reading a key.
+ `-c` "Comment" Changes the comment for a keyfile.
+ `-p` Change the passphrase of a private key file.
+ `-q` Silence ssh-keygen.
+ `-l` "Fingerprint" Print the fingerprint of the specified public key.
+ `-B` "Bubble babble" Shows a "bubble babble" (Tectia format) fingerprint of a keyfile.
+ `-F` Search for a specified hostname in a known_hosts file.
+ `-R` Remove all keys belonging to a hostname from a known_hosts file.
+ `-y` Read a private OpenSSH format file and print an OpenSSH public key to stdout.