Feature: Recipe management

  As a logged-in user
  I want to add, edit, and delete my own recipes
  So that I can maintain my personal recipe collection

  Background:
    Given I am logged in

  Scenario: Access personal dashboard as an authenticated user
    Given I am logged in
    When I access my dashboard
    Then I should have access to my personal dashboard

  Scenario: Add a new recipe
    Given I am on my personal dashboard
    When I create a new recipe
    And I enter a recipe name
    And I select a picture icon from the predefined set
    And I enter cooking directions
    And I add ingredients with quantities and units
    Then the recipe should be saved
    And the recipe should be available in the recipe list

  Scenario: Edit an existing recipe
    Given I have a recipe of my own on my personal dashboard
    When I edit that recipe's details
    Then the updated recipe should be saved
    And the recipe list should reflect the changes

  Scenario: Delete an existing recipe
    Given I have a recipe of my own on my personal dashboard
    When I delete that recipe
    Then the recipe should no longer be saved
    And the recipe should no longer appear in the recipe list
