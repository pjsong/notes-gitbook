# [LetsEncrypt](https://letsencrypt.org/)

[https://pythonprogramming.net/django-web-server-https-lets-encrypt-ssl/](https://pythonprogramming.net/django-web-server-https-lets-encrypt-ssl/)

## [how it works](https://letsencrypt.org/how-it-works)

    apt-get update
    apt-get install -y git
    cd volumeCode/project
    git clone https://github.com/certbot/certbot
    cd certbot && ./letsencrypt-auto --help
    service nginx stop
    ./letsencrypt-auto certonly --standalone -d example.com
    sudo nano /etc/nginx/sites-available/django

```text
listen 443 ssl;
server_name example.com;
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem
ssl_certificate_key /etc/letsencrypt/live/example.com/privatekey.pem
server{
   listen 80;
   server_name example.com;
   return 301 https://$host$request_uri;
}
```

## digital ocean(https://pythonprogramming.net/django-web-server-https-lets-encrypt-ssl/)

pythonprogramming.net

+ create a droplet(vps of digitalocean), one-click app, 
+ ssh root@ip , or use putty

[https://simpleisbetterthancomplex.com/tutorial/2016/05/11/how-to-setup-ssl-certificate-on-nginx-for-django-application.html](https://simpleisbetterthancomplex.com/tutorial/2016/05/11/how-to-setup-ssl-certificate-on-nginx-for-django-application.html)