Feature: Application-wide navigation errors

  As a user
  I want to see a clear error when I open a URL that doesn't exist
  So that I understand my link is invalid rather than being silently redirected somewhere else

  @application-1
  Scenario: Show 404 for an unmatched URL
    Given I open a URL that doesn't match any route in the application
    Then I should see a 404 page

  @application-2
  Scenario: Show 404 for a recipe id that doesn't exist
    Given I open a recipe detail URL for an id that doesn't exist
    Then I should see a 404 page
