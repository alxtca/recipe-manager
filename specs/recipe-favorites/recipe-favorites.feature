Feature: Recipe favorites

  As a logged-in user
  I want to add recipes to my favorites and filter by them
  So that I can quickly find the recipes I like most

  Background:
    Given recipes exist in the application

  @recipe-favorites-1
  Scenario: Anonymous users cannot use favorites
    Given I am not logged in
    When I view the recipe list or a recipe's detail page
    Then I should not see an "Add to favorites" or "Remove from favorites" button
    And I should not see a "Favorites" filter checkbox

  @recipe-favorites-2
  Scenario Outline: Add a recipe to favorites
    Given I am logged in
    And a recipe is not in my favorites
    Then the recipe's <location> should show an "Add to favorites" button with an outlined heart
    When I click the "Add to favorites" button
    Then the recipe should be added to my favorites immediately
    And the button should change to "Remove from favorites" with a filled heart

    Examples:
      | location    |
      | card        |
      | detail page |

  @recipe-favorites-3
  Scenario Outline: Remove a recipe from favorites
    Given I am logged in
    And a recipe is in my favorites
    Then the recipe's <location> should show a "Remove from favorites" button with a filled heart
    When I click the "Remove from favorites" button
    Then the recipe should be removed from my favorites immediately
    And the button should change to "Add to favorites" with an outlined heart

    Examples:
      | location    |
      | card        |
      | detail page |

  @recipe-favorites-4
  Scenario: Favorite button on a card does not open the detail page
    Given I am logged in
    And I am viewing the recipe list
    When I click the favorite button on a recipe card
    Then I should stay on the homepage

  @recipe-favorites-5
  Scenario: Favorite my own recipe
    Given I am logged in
    And I own a recipe
    When I add that recipe to my favorites
    Then it should be in my favorites

  @recipe-favorites-6
  Scenario: Favorites are per user
    Given user A has added a recipe to their favorites
    When I log in as user B
    Then that recipe should show an "Add to favorites" button for me

  @recipe-favorites-7
  Scenario: Favorites are remembered
    Given I am logged in
    And I have added a recipe to my favorites
    When I refresh the page or log out and log back in as the same user
    Then that recipe should still be in my favorites

  @recipe-favorites-8
  Scenario: Filter recipes by favorites
    Given I am logged in
    And some recipes are in my favorites
    When I check the "Favorites" filter checkbox
    Then only recipes in my favorites should be displayed

  @recipe-favorites-9
  Scenario: Combine favorites filter with other filters
    Given I am logged in
    And my favorites include recipes from multiple cuisines
    When I check the "Favorites" filter checkbox and set a cuisine filter
    Then only my favorite recipes matching that cuisine should be displayed

  @recipe-favorites-10
  Scenario: Favorites filter with no favorites
    Given I am logged in
    And I have no favorite recipes
    When I check the "Favorites" filter checkbox
    Then I should see "No recipes match the selected filters."

  @recipe-favorites-11
  Scenario: Deleting a recipe removes it from favorites
    Given a recipe is in a user's favorites
    When the recipe's owner deletes it
    Then it should no longer be in any user's favorites
