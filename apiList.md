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
-GET/user/requests
-GET/user/connections
-GET/user/feed    


## status- interested ,ignored
## status-accepted ,rejected

-Pagination

/feed?page=1 & limit=10 =>1-10 => .skip(0)  & .limit(10)
/feed?page=1 & limit=10 =>11-20 => .skip(10)  & .limit(10)
/feed?page=1 & limit=10 =>21-30 => .skip(20)  & .limit(10)


skip=(page-1)*limit;


## make fogot api