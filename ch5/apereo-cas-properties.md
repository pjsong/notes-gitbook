
###[webflow](https://apereo.github.io/cas/4.2.x/installation/Webflow-Customization.html)
+ ` # create.sso.missing.service=false` 如果没有指定服务，不创建SSO会话   
+ `# webflow.encryption.key=缺省16位` 
+ `# webflow.signing.key=缺省512位`
<pre>cas能存储flow执行的状态。当cas提交view，flow state就存储在提供给client的flow execution identifier中。<br>cas能自动追踪状态，就可以不必清理，复制，结束会话了。该组件由`loginFlowStateTranscoder`控制。
如果没有配置警告信息如下
WARN [org.jasig.cas.util.BinaryCipherExecutor] - <Secret key for encryption is not defined. CAS will attempt to auto-generate the encryption key>
WARN [org.jasig.cas.util.BinaryCipherExecutor] - <Generated encryption key ABC of size ... . The generated key MUST be added to CAS settings.>
WARN [org.jasig.cas.util.BinaryCipherExecutor] - <Secret key for signing is not defined. CAS will attempt to auto-generate the signing key>
WARN [org.jasig.cas.util.BinaryCipherExecutor] - <Generated signing key XYZ of size ... . The generated key MUST be added to CAS settings.>
</pre>