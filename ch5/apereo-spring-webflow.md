
###[webflow](https://apereo.github.io/cas/4.2.x/installation/Webflow-Customization.html)


###cas的webflow





###例子
[参考](https://examples.javacodegeeks.com/enterprise-java/spring/web-flow/spring-web-flow-tutorial/)

+ success.jsp
> <code>&lt;body>
Welcome ${loginBean.userName}!!
&lt;/body></code>

+ login.jsp
<pre>
    &lt;form method="post" action="${flowExecutionUrl}">
		&lt;input type="hidden" name="_eventId" value="performLogin"> 
		&lt;input type="hidden" name="_flowExecutionKey" value="${flowExecutionKey}" />
		&lt;input type="text" name="userName" maxlength="40">
		&lt;input type="password" name="password" maxlength="40">
		&lt;input type="submit" value="Login" />
	&lt;/form>
</pre>

+ web.xml
<pre>
  &lt;servlet&gt;
	&lt;servlet-name>springFlowApplication</servlet-name>
	&lt;servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	&lt;init-param>
		&lt;param-name>contextConfigLocation</param-name>
		&lt;param-value>classpath://spring-config.xml</param-value>
	&lt;/init-param>
	&lt;load-on-startup>1</load-on-startup>
  &lt;/servlet>
  &lt;servlet-mapping>
   &lt;servlet-name>springFlowApplication</servlet-name>
   &lt;url-pattern>/</url-pattern>
  &lt;/servlet-mapping></pre>

+ spirng-config.xml
<pre>
	&lt;context:component-scan base-package="com.jcg.examples" />
	&lt;bean
	class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		&lt;property name="prefix" value="/jsp/" />
		&lt;property name="suffix" value=".jsp" />
	&lt;/bean>
	&lt;import resource="flow-definition.xml"/>
</pre>

+ flow-definition.xml
 <pre>
	&lt;bean class="org.springframework.webflow.mvc.servlet.FlowHandlerMapping">
		&lt;property name="flowRegistry" ref="bookSearchFlowRegistry" />
	&lt;/bean>
	&lt;bean class="org.springframework.webflow.mvc.servlet.FlowHandlerAdapter">
		&lt;property name="flowExecutor" ref="bookSearchFlowExecutor" />
	&lt;/bean>
	&lt;flow:flow-executor id="bookSearchFlowExecutor" flow-registry="bookSearchFlowRegistry" />
	&lt;flow:flow-registry id="bookSearchFlowRegistry">
		&lt;flow:flow-location id="bookSearchFlow" path="/flows/book-search-flow.xml" />
	&lt;/flow:flow-registry> 
 </pre>

+ book-search-flow.xml
<pre>
	&lt;var name="loginBean" class="com.jcg.examples.bean.LoginBean" />
	&lt;view-state id="displayLoginView" view="jsp/login.jsp" model="loginBean">
		&lt;transition on="performLogin" to="performLoginAction" />
	&lt;/view-state>
	&lt;action-state id="performLoginAction">
		&lt;evaluate expression="loginService.validateUser(loginBean)" />
		&lt;transition on="true" to="displaySuccess" />
		&lt;transition on="false" to="displayError" />
	&lt;/action-state>
	&lt;view-state id="displaySuccess" view="jsp/success.jsp" model="loginBean"/>
	&lt;view-state id="displayError" view="jsp/failure.jsp" />
</pre>


+ LoginService.java
<pre>
@Service
public class LoginService {
		public String validateUser(LoginBean loginBean)		{
				String userName = loginBean.getUserName();
				String password = loginBean.getPassword();
				return Boolean.toString(userName.equals("Chandan") && password.equals("TestPassword");
		}
}
</pre>


+ LoginBean
<pre>
public class LoginBean implements Serializable
{
		private static final long serialVersionUID = 1L;
		private String userName;
		private String password;
//........ommited
</pre>

