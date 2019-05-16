# ILOG2019 - Créer un device JUnit

This project lets the user run JUnit tests within a suite and send the results on a serial port, to which we can connect an Arduino board, for instance.

## Getting Started

### Prerequisite

JUnit 4 and higher

### Running the tests

Annotate test suite with :

```
@SetCommPort("PORT TO BE USED")
@RunWith(SerialSuite.class)
@SuiteClasses({ testClass1.class, testClass2.class, testClass3.class })
```

