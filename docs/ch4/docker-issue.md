# issue

## 安装新版本启动问题

### 执行`journalctl -xt`

```text
-- Unit docker.socket has begun starting up.
5月 07 08:11:14 pjsong-desktop systemd[1]: Listening on Docker Socket for the API.
-- Subject: Unit docker.socket has finished start-up
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit docker.socket has finished starting up.
-- 
-- The start-up result is done.
5月 07 08:11:14 pjsong-desktop systemd[1]: docker.service: Start request repeated too quickly.
5月 07 08:11:14 pjsong-desktop systemd[1]: Failed to start Docker Application Container Engine.
-- Subject: Unit docker.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit docker.service has failed.
```

### 执行`service docker status`

```text
docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
  Drop-In: /etc/systemd/system/docker.service.d
           └─docker.conf
   Active: inactive (dead) (Result: exit-code) since 一 2018-05-07 08:11:14 CST; 24min ago
     Docs: https://docs.docker.com
 Main PID: 12337 (code=exited, status=1/FAILURE)

5月 07 08:11:13 pjsong-desktop systemd[1]: Failed to start Docker Application Container Engine.
5月 07 08:11:13 pjsong-desktop systemd[1]: docker.service: Unit entered failed state.
5月 07 08:11:13 pjsong-desktop systemd[1]: docker.service: Failed with result 'exit-code'.
5月 07 08:11:14 pjsong-desktop systemd[1]: docker.service: Service hold-off time over, scheduling restart.
5月 07 08:11:14 pjsong-desktop systemd[1]: Stopped Docker Application Container Engine.
5月 07 08:11:14 pjsong-desktop systemd[1]: docker.service: Start request repeated too quickly.
5月 07 08:11:14 pjsong-desktop systemd[1]: Failed to start Docker Application Container Engine.
```

### 执行 `systemctl status docker.socket`

```text
● docker.socket - Docker Socket for the API
   Loaded: loaded (/lib/systemd/system/docker.socket; enabled; vendor preset: enabled)
   Active: failed (Result: service-start-limit-hit) since 一 2018-05-07 08:39:22 CST; 59s ago
   Listen: /var/run/docker.sock (Stream)

5月 07 08:39:22 pjsong-desktop systemd[1]: Closed Docker Socket for the API.
5月 07 08:39:22 pjsong-desktop systemd[1]: Stopping Docker Socket for the API.
5月 07 08:39:22 pjsong-desktop systemd[1]: Starting Docker Socket for the API.
5月 07 08:39:22 pjsong-desktop systemd[1]: Listening on Docker Socket for the API.
5月 07 08:39:22 pjsong-desktop systemd[1]: docker.socket: Unit entered failed state.
```

## 诊断

+ sudo dockerd正常，之后再docker info,