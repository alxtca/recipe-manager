Feature: Recipe Manager Application

  As a user
  I want to browse and manage recipes
  So that I can discover and maintain cooking recipes

  # Implementation clarifications (agreed during planning, see plan for detail):
  # - Authentication: no backend/password. A login screen lists a fixed set of
  #   demo users; picking one logs you in as that user for the session.
  # - Persistence: all data (recipes + current session) is stored in the
  #   browser's localStorage, so it survives a page refresh, but there is
  #   still no server/database.
  # - Recipe "picture": instead of a real file upload, the user selects one
  #   icon from a fixed, predefined set of food icons. A recipe's card only
  #   shows an icon if one was selected.
  # - Cuisine types are a fixed list: Italian, Mexican, Indian, Chinese,
  #   American, French, Japanese, Mediterranean, Thai, Other.
  # - Ingredients are entered as dynamic rows of name + numeric quantity +
  #   unit (g, kg, ml, l, cups, tbsp, tsp, pcs), addable/removable.
  # - The personal dashboard supports editing and deleting your own recipes,
  #   in addition to adding new ones.
  # - Filters (user, cuisine, include ingredients, exclude ingredients)
  #   combine with AND logic and live in an always-visible sidebar on the
  #   homepage.
  # - Built with Angular (standalone components + signals) and Angular
  #   Material; no NgRx, no backend HTTP calls.

  Background:
    Given the Recipe Manager application is available
    And the application can be used without authentication

  Scenario: Browse recipes on the homepage
    Given I open the homepage
    Then I should see a recipe list displayed in 3 columns
    And I should see a maximum of 21 recipe cards per page

  Scenario: View recipe information on a card
    Given recipes exist in the application
    When I view the recipe list
    Then each recipe card should display the recipe name
    And each recipe card should display a picture icon when one is available

  Scenario: Display pagination when more than 21 recipes exist
    Given there are more than 21 recipes
    When I open the homepage
    Then pagination controls should be displayed
    And only 21 recipe cards should be shown on a page

  Scenario: Filter recipes by user
    Given recipes exist from multiple users
    When I filter recipes by a specific user
    Then only recipes created by that user should be displayed

  Scenario: Filter recipes by cuisine type
    Given recipes exist with different cuisine types
    When I filter recipes by a cuisine type
    Then only recipes matching the selected cuisine type should be displayed

  Scenario: Filter recipes by ingredients
    Given recipes exist with different ingredients
    When I filter recipes using one or more ingredients
    Then only recipes containing all of those ingredients should be displayed

  Scenario: Exclude recipes containing specific ingredients
    Given recipes exist with different ingredients
    When I exclude one or more ingredients from the search
    Then recipes containing any of the excluded ingredients should not be displayed

  Scenario: Combine multiple filters
    Given recipes exist from multiple users, cuisines, and ingredients
    When I apply a user filter, a cuisine filter, and an ingredient filter together
    Then only recipes matching all of the selected filters should be displayed

  Scenario: Sort recipes by creation date
    Given recipes exist in the application
    When I sort recipes by date added
    Then recipes should be displayed in date order
    And the newest recipe is shown first by default

  Scenario: Log in as a demo user
    Given I am not logged in
    When I open the login screen
    And I select one of the predefined demo users
    Then I should be logged in as that user
    And my session should be remembered if I refresh the page

  Scenario: Access personal dashboard as an authenticated user
    Given I am logged in
    When I access my dashboard
    Then I should have access to my personal dashboard

  Scenario: Add a new recipe
    Given I am logged in
    And I am on my personal dashboard
    When I create a new recipe
    And I enter a recipe name
    And I select a picture icon from the predefined set
    And I enter cooking directions
    And I add ingredients with quantities and units
    Then the recipe should be saved
    And the recipe should be available in the recipe list

  Scenario: Edit an existing recipe
    Given I am logged in
    And I have a recipe of my own on my personal dashboard
    When I edit that recipe's details
    Then the updated recipe should be saved
    And the recipe list should reflect the changes

  Scenario: Delete an existing recipe
    Given I am logged in
    And I have a recipe of my own on my personal dashboard
    When I delete that recipe
    Then the recipe should no longer be saved
    And the recipe should no longer appear in the recipe list

  Scenario: Anonymous users cannot add recipes
    Given I am not logged in
    When I access the application
    Then I should be able to browse recipes
    But I should not be able to add a recipe
    And I should be redirected to the login screen if I try to access the dashboard

  Scenario: Front-end only implementation
    Given the application is running
    Then the application should be implemented using Angular
    And all data should be stored in browser memory (localStorage)
    And no database or backend server should be required
