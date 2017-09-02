Technicolor TD5336 Pwned
======

Hello world! How are you today?

Yesterday I arrived home from work, after a week of training and studing web app pentest. Can't say I didn't learn a lot of things, and trained as well. Then, I realized it was friday. I Didn't feel like drinking or hanging out, so I did what few people do on a friday night: I **hacked** some shit. :^)

Well, like anything people do, I began looking for a target to focus on. And my target the **technicolor TD5336 router**, which you can find info about it [here](http://www.technicolor.com/en/solutions-services/connected-home/broadband-devices/telco-gateways/td336). This guy seems cool enough for me to have a little fun on a friday night. So, fasten your seat belts kiddo, here we go.


First and above all, I did a port scan on the router. Saw the telnet port open, so did a connection to it with the default credentials (that would be **admin:admin**).

![1]({{ site.url }}/imgs/tech-r5336/1.png)

But when I typed a command: 

![2]({{ site.url }}/imgs/tech-r5336/2.png)

It seems that the default shell is some shitty config interpreter. So what? It's time to hack!

My objective was to connect to the router using a reverse shell. So, after looking the admin http page, I saw this feature.

![4]({{ site.url}}/imgs/tech-r5336/4.png)

Well, if you have been training web pentest on the OWASP Bad Web Apps, you know that features that use like binaries like in a shell session have a great chance of not beign properly sanitized.

So, I fired up __Burp Suite__ and send a ``echo`` command to see if it does the trick. 

![5]({{ site.url }}/imgs/tech-r5336/5.png)

So, I went to see the results and...

![6]({{ site.url }}/imgs/tech-r5336/6.png)

Yes, it does, ladies and gentlemen! We have a [command injection](https://www.owasp.org/index.php/Command_Injection) vulnerability. What a great day to be alive!

After that, I send the infamous ``cat /etc/passwd`` to see about the users on this router. What a surprise I got.

![7]({{ site.url }}/imgs/tech-r5336/7.png)

There are 3 users in the file, only 2 are available to login. But one (super) isn't specified anywhere on the manual. Maybe is a backdoor? Hum...

Anyway, after that I tried some reverse shells commands, like ``nc`` and ``telnet`` to no aval. It seems that the router didn't have those binaries. So, I decided to just change the shell of the __admin__ user, from ``config`` to ``sh``. 

My first throught was to directly overwrite the passwd file, so I tried this command: ``echo -n 'admin:$1$$CoERg7ynjYLsj2j4glJ34.:1:0::/tmp:/bin/sh' > /etc/passwd ``, to no avail. The page returned me like the ping command returned an error.

![8]({{ site.url }}/imgs/tech-r5336/8.png)

![9]({{ site.url }}/imgs/tech-r5336/9.png)
