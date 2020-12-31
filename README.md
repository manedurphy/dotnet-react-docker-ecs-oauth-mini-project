# dotnet-react-docker-ecs-oauth-mini-project

# Introduction
This is a mini project I created to better understand authentication through local strategies and OAuth (via GitHub and Google). This application was developed and deployed in Docker containers between the frontend (React SPA using TypeScript) and backend (ASP.NET Core 5) using AWS ECS.

# Local Strategy
For local strategy authentication, the user may register with their first and last name, email, and password. On success, the user is redirected to the login form where he or she can enter the credentials used at registration. Upon successful login, the user will receive a JSON Web Token with a 10 minute lifetime, as well as a Refresh Token attached to their information stored in the MongoDB Atlas database. Both tokens are stored in local stored, and upon expiration of the JWT, the "/refresh" route in the AuthorizationController will receive the Refresh Token and grant the user a new Refresh Token and JWT, as well as update the Refresh Token in the database.

# OAuth (GitHub)
If the user wishes to login via GitHub, they may do so in the OAuth route. By clicking the GitHub option, the user is redirected to the GitHub authorization page where they must verify that they are okay with granting the application access to their user information. Should the user approve, they are redirected back the application with a code parameter added to the URL. The UseEffect hook then make a request to the "get-access-token" endpoint with this code, where the backend then makes an additional request to GitHub's authorization server (with ClientId, ClientSecret, and Code) to receive an Access Token. The access token is sent back to the client and is used to make a request to GitHub's resource server to get the user's email. On success, another request is made from the client to the .NET backend with the email received, the "platform" that the user is being authorized with (GitHub in this case), and the same access token they had just received. This request body is sent to the "/OAuthProfiles/authorize" endpoint where another request is sent to the GitHub resource server for the client's GitHub username and Avatar URL. On success, these credentials are stored in the MongoDB database in the OAuthProfiles cluster along with a refresh token just as the local strategy. The user is then sent that refresh token as well as a 10 minute JWT, both of which are stored in local storage, and the user is then redirected to the home page where he or she can see data from a protected endpoint (the default WeatherForecast from dotnet webapi template). This strategy demonstrates the standard process of Authorization Code Flow.

# OAuth (Google)
The flow for the Google option is slightly different. The user is prompted in a new window to select their Google account, and upon consent, the client immediate recevies informatino from the user's google profile (no auth code or access token). In the onSignIn callback, a request is made from the client to the "/OAuthProfiles/google" route with the idToken and email in the request body. The endpoint makes an additional request to Google with the idToken to confirm the is legitimate. Credentials are stored in the database as they were for GitHub. This resembles more of an implicit flow as there was no use for the GoogleID or Secret.

# Docker & Deployment
The React frontend and ASP.NET backend both ran in their own Docker containers for development and production. For development, React was served with a webpack development server, and for production, and Nginx image was used to serve the final build files. Each image was pushed to individual DockerHub repositories. To set up the ECS cluster, I created a service for both the frontend and backend containers with their own load balancers. A link for the deployed project is found at the bottom.

# Note
The user may only login using one strategy at a time (to avoid duplicate emails in database). In the protected route, there is a button at the bottom that will allow the user to delete their current credentials and login with a different strategy.

LINK:
  http://ecs-lb-frontend-1727102227.us-east-1.elb.amazonaws.com/
