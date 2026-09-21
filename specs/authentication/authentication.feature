Feature: Authentication

  As a visitor
  I want to log in as one of a set of predefined demo users
  So that I can manage my own recipes

  Background:
    Given the Recipe Manager application is available

  Scenario: Log in as a demo user
    Given I am not logged in
    When I open the login screen
    And I select one of the predefined demo users
    Then I should be logged in as that user
    And my session should be remembered if I refresh the page

  Scenario: Anonymous users cannot add recipes
    Given I am not logged in
    When I access the application
    Then I should be able to browse recipes
    But I should not be able to add a recipe
    And I should be redirected to the login screen if I try to access the dashboard
