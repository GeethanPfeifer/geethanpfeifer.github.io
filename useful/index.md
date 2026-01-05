[return](../index.html)

## useful commands

`pandoc index.md -o index.html` (what I'm using to compile this document)

`./llama-cli -m gemma3-270m-it-q4_k_m.gguf -c 2048` (run a model with llama-cli, `-c 2048` part optional)

`unzip arch.zip -d arch` (unzips arch.zip to directory arch)

`sudo chmod 777 dir` (makes a directory/file readable, writeable, and executable by all users)

### [fclones](https://github.com/pkolaczk/fclones)

`fclones group . >dupes.txt` (generate list of dupes)

`sudo fclones link <dupes.txt` (convert dupes to hard links--didn't work without sudo)

`rsync -avvvxHP --bwlimit=20000 --stats /.../source /.../dest` (creates `/.../dest` as a copy of `/.../source`)

`wget -r -l 0 -D geethanpfeifer.github.io https://geethanpfeifer.github.io` (download mirror of webpage)

`sudo losetup -d /dev/loop0` (detach loop device)

## useful files

`/etc/dnsmasq.conf` (dnsmasq config file)

`/etc/NetworkManager/NetworkManager.conf` (NetworkManager config file)

---

This page is licensed under [The Unlicense.](../licenses/unlicense.txt)

This page will likely be useless to anyone but me, but my goal in creating it is to have an online reference for stuff I will likely forget.
