# DevTinder APIS


## AuthRouter
-POST/signup
-POST/login
-POST/logout

## ProfileRouter
-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password  - forgot password API(H.W.)


## ConnectionRequestRouter
-POST/request/send/interested/:touserId
-POST/request/send/ignored/:userId

-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId

## userRouter
-GET/user/connections
-GEt/user/requests/recevied
-GET/user/feed    


## status- interested ,ignored
## status-accepted ,rejected