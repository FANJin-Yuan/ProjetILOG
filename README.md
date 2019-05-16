# ILOG2019 - Créer un device JUnit

This project lets the user run JUnit tests within a suite and send the results on a serial port, to which we can connect a device like an Arduino board, for instance, to process the results.

## Getting Started

### Prerequisite

JUnit 4 and higher

### Running the tests

Annotate test suite with :

```
@SetCommPort("PORT TO BE USED") //String with the name of the serial port to be used
@RunWith(SerialSuite.class)
@SuiteClasses({ testClass1.class, testClass2.class, testClass3.class }) //Between brackets are the several test Classes the Suite is made of
```

Run JUnit Test Suite

### Example of an application

To demonstrate the use of our project, we are using an Arduino board with a LCD screen and printing the test results on the board which changes colors based on individual test results within the suite and with a navigating feature.

## Authors

* Jaime Orts-Caroff
* Théo Chombart