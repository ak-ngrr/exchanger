# Currency Exchanger
- This application has allows to get real time currency conversion for various currencies being used worldwide. Also the It allows users to see detailed information about a particular currency which includes historical rates as well. The historical data can be seen graphically also (in Bar Chart).

Details of different components 
  - Home Page : User can select any of the available currenciews from the "To" and "From" dropdowns and enter the amount to be converted. Then licking on the Convert button will show the converted amount in the currency being selected in "To" dropdown.
  - Also, onversion to 9 popular currencies will also be displayed just below the conversion panel.
  - To see the detailed view, user can click on the "More Details" button which will redirect the user to the details page where the user will be able to see the historical rates of the currency in form of a Bart chart.
  - On the details page itself , the user can change the "To" currency and click to see the corrensponding conversion and also the updated bar chart for historical rates. User can navigate to home page as well by clicking on "Back to Home" button.
  - The application has a navigation bar which contains a brand log and to buttons "EUR-USD Details" and "EUR-GBP Details" which will redirect the user to the details page with the historical rates deatils for the currencies labelled as button labels.

# Prerequistes to run the application

- Node.js
- Angular CLI
- A web browser

# Steps to run the application
- The application needs a valid token to fetch the information from the api server.  That can be foung in the file "src\app\core\contants.ts". User would need to replace it with a new valid token and then can run the application.

- Command to run the application
  **ng serve**
- Command to run unit test cases
  **ng test**
- Command to run unit test cases with code coverage
  **ng test --code-coverage**
- Command to run unit test cases
  **ng lint**  

# Features and tools being used
- Lazy loading
- Linting etc.
- RxJs
- Higher order observables
- ESLint
- Prettier
- Angular Material
- Kendo ui


# Unit test coverage
- Unit test cases has also been written and the current coverage for the same can be reffered below-

![image](https://user-images.githubusercontent.com/108716795/196702954-967e6739-f03d-40ea-beae-89eb6de4cccd.png)

# Application screenshots
![home](https://user-images.githubusercontent.com/108716795/196707451-b3bfb028-70de-43cb-b187-0227eb25ab3a.png)

![image](https://user-images.githubusercontent.com/108716795/196707384-e9c7a841-98b3-42b9-8b8c-7792f26d4ecb.png)

# What can be improved?
- Auth Guards
- Http Interceptors
- Loading spinner while fetching data etc.

