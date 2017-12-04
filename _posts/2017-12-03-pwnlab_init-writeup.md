# Writeup Pwnlab_init


## Enumeration
First I did a scan with **nmap** scanning the first 10000 ports to see the open ones.

```nmap -p1-10000 -sS -T5 10.0.2.24```

After enumerating some open ports, it was time to service/banner scan.
```
Nmap scan report for 10.0.2.24
Host is up (0.00044s latency).

PORT     STATE  SERVICE        VERSION
80/tcp   open   http           Apache httpd 2.4.10 ((Debian))
111/tcp  open   rpcbind        2-4 (RPC #100000)
2791/tcp closed mtport-regist
3014/tcp closed broker_service
3306/tcp open   mysql          MySQL 5.5.47-0+deb8u1
3322/tcp closed active-net
3665/tcp closed ent-engine
9452/tcp closed unknown
MAC Address: 08:00:27:22:B7:9F (Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Thu Nov 30 20:54:21 2017 -- 1 IP address (1 host up) scanned in 24.08 seconds
```

After that, I opened the site on the port 80 and did a recon on the page.

I could see that the server did a *include* with every file that has been refered
by the *page* param in the URL... hm...
That reminds me of a **LFI**.

## Web Exploitation

Now, is time to exploit that LFI.

First thing I did was trying to get access to the `/etc/passwd` file with no avail:

```
Didn't worked: I could not separate the .php append from the code using a LFI.
Possibly using include or require_once.
http://10.0.2.24/?page=../../../../../etc/passwd%00
```

As that didn't worked, I did a trick I learned from a CTF in shellter labs (great platform anyway). The so called **PHP INCLUSION FILTER**.

```
http://10.0.2.24/?m=php://filter/convert.base64-encode/resource=index
```
And that returned me the source code encoded in base64.

![lfi_filter]({{ site.url }}/imgs/write-ups/pwnlab_init/lfi_filter_php_base64.png)

Lovely, don't you think?

Analysing the code from the pages, I could see a reference to a __config.php__
in the index page. So I downloaded that source and what did I see?

![config_mysql]({{ site.url }}/imgs/write-ups/pwnlab_init/mysql_credentials.png)

Using that credentials and connecting to the mysql database, I found this:

![mysql_users]({{ site.url }}/imgs/write-ups/pwnlab_init/database_credentials.png)

Now I had user access and could use the upload function to transform a LFI
into a RCE.

After loging as mike, I wrote a [payload embeded into a png]({{ site.url }}/files/payloads/shell.png) to open a shell. But there is one problem: the page param didn't worked because
I couldn't include a file ending with .png and I could't upload a file that
wasn't a image (and also with a image extension). I had to find another way in.

And I did.

![lang_cookie](imgs/write-ups/pwnlab_init/lang_cookie.png)

So I set the **lang** cookie to ``../images/[md5hash].png`` and executed my payload.
With some **netcat** trickery, I finally got home:

![reverse_shell]({{ site.url }}/imgs/write-ups/pwnlab_init/reverse_shell.png)
Say hello to the reverse shell :)

## Privilege Escalation

After lurking the system for some time, I did a recon on the box and found the
kernel version very interesting:

```
$:uname -a
Linux pwnlab 3.16.0-4-686-pae #1 SMP Debian 3.16.7-ckt20-1+deb8u4 (2016-02-29) i686 GNU/Linux
```

After some research, I found the **dirtyc0w** exploit and decided to give it a try.

I did the shellcode uncommenting and compiled to the x86 platform:
```
gcc -m32 cow.c -o cow
```

After running into the box:

```
$:./cow
whoami
root
```

And that's all, folks. See you in the next writeup!
