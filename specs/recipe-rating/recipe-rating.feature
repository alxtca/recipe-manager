Feature: Recipe rating

  As a logged-in user
  I want to rate recipes from 1 to 10 and see their average rating
  So that I can share my opinion and find well-liked recipes

  Background:
    Given recipes exist in the application

  @recipe-rating-1
  Scenario: Display average rating on homepage cards
    Given a recipe has been rated by several users
    When I view the recipe list
    Then that recipe's card should show the average rating with one decimal
    And it should show the number of ratings

  @recipe-rating-2
  Scenario: Display average rating on the detail page
    Given a recipe has been rated by several users
    When I open that recipe's detail page
    Then I should see the average rating with one decimal
    And I should see the number of ratings

  @recipe-rating-3
  Scenario: Display unrated recipes
    Given a recipe has no ratings
    When I view that recipe's card or detail page
    Then I should see "Not rated yet"

  @recipe-rating-4
  Scenario: Anonymous users cannot rate
    Given I am not logged in
    When I view a recipe's card or detail page
    Then I should see the recipe's average rating
    But I should not see a "Rate" or "Edit" button

  @recipe-rating-5
  Scenario Outline: Rate a recipe
    Given I am logged in
    And I have not rated a recipe
    When I click the "Rate" button on the recipe's <location>
    Then I should see a dropdown with values 1 to 10
    When I select "8"
    Then my rating should be saved immediately
    And the dropdown should be replaced by the score view
    And the average rating should include my rating
    And I should see "Your rating: 8" with an "Edit" button

    Examples:
      | location    |
      | card        |
      | detail page |

  @recipe-rating-6
  Scenario Outline: Edit my rating
    Given I am logged in
    And I have rated a recipe "8"
    When I click the "Edit" button on the recipe's <location>
    Then the score view should be replaced by a dropdown with "8" selected
    When I select "5"
    Then my rating should be updated to 5 immediately
    And the dropdown should be replaced by the score view
    And the average rating should reflect my updated rating

    Examples:
      | location    |
      | card        |
      | detail page |

  @recipe-rating-7
  Scenario: Only one rating per user per recipe
    Given I am logged in
    And I have rated a recipe
    When I view that recipe
    Then I should not see a "Rate" button
    And changing my rating should replace my previous rating rather than add a new one

  @recipe-rating-8
  Scenario: Rate my own recipe
    Given I am logged in
    And I own a recipe
    When I rate that recipe
    Then my rating should be saved and included in its average

  @recipe-rating-9
  Scenario: Rating on a card does not open the detail page
    Given I am logged in
    And I am viewing the recipe list
    When I use the rating controls on a recipe card
    Then I should stay on the homepage

  @recipe-rating-10
  Scenario: Filter recipes by minimum rating
    Given recipes exist with different average ratings, and some are unrated
    When I set the minimum rating filter to "7"
    Then only recipes with an average rating of 7 or higher should be displayed
    And unrated recipes should not be displayed

  @recipe-rating-11
  Scenario: Combine rating filter with other filters
    Given recipes exist from multiple cuisines with different average ratings
    When I set a cuisine filter and a minimum rating filter
    Then only recipes matching both filters should be displayed

  @recipe-rating-12
  Scenario: Sort recipes by rating
    Given recipes exist with different average ratings, and some are unrated
    When I sort recipes by rating
    Then recipes should be displayed from highest to lowest average rating
    And unrated recipes should be displayed last

  @recipe-rating-13
  Scenario: Date remains the default sort
    Given recipes exist with ratings
    When I open the homepage
    Then recipes should be sorted by date added, newest first
