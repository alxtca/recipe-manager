Feature: Recipe detail view

  As a user
  I want to view a recipe's full details from its card
  So that I can read its ingredients and directions before cooking

  Background:
    Given recipes exist in the application

  Scenario: Navigate to a recipe's detail page from its card
    Given I am viewing the recipe list
    When I click on a recipe card
    Then I should be navigated to that recipe's detail page

  Scenario: View recipe details
    Given I am on a recipe's detail page
    Then I should see the recipe name
    And I should see the recipe's picture icon
    And I should see the ingredient list
    And I should see the cooking directions
    And I should see who posted the recipe

  Scenario: Scale ingredient quantities by portion count
    Given I am on a recipe's detail page
    When I select a portion multiplier of "2"
    Then every ingredient quantity should be multiplied by 2

  Scenario: Halve ingredient quantities
    Given I am on a recipe's detail page
    When I select a portion multiplier of "0.5"
    Then every ingredient quantity should be divided by 2

  Scenario: Default portion is unscaled
    Given I am on a recipe's detail page
    Then the portion multiplier should default to "1"
    And ingredient quantities should match the quantities as entered

  Scenario: Show edit button for the recipe owner
    Given I am logged in
    And I am viewing the detail page of a recipe I own
    Then I should see an "Edit" button
    When I click the "Edit" button
    Then I should be navigated to that recipe's edit page

  Scenario: Hide edit button for non-owners
    Given I am viewing the detail page of a recipe I do not own
    Then I should not see an "Edit" button

  Scenario: Hide edit button for anonymous users
    Given I am not logged in
    And I am viewing a recipe's detail page
    Then I should not see an "Edit" button
