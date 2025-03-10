# career-talks-systematic-estimates-application
This is the official repo for career talks at systematic workshop

To run the application, you should:
1. start postgres container: open a terminal, then run ``cd backend``, then run ``docker compose up``. Observe in Docker Desktop that postgres has started. Or run ``docker ps`` to check active containers
2. start Spring application: link backend gradle project (right click on build.gradle and press Link gradle project). Run EstimatesApplication
3. start Angular application:
    1. open another terminal, then run ``cd backend``, then run ``npm i``
   2. run ``npx ng serve``. Observe that localhost:4200 page is available

Now you are good to go :)
