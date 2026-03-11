import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import OutCall "http-outcalls/outcall";

actor {
  type Title = Text;
  type Description = Text;
  type Hashtag = Text;
  type TimeRecommendation = {
    time : Text;
    region : Text;
    typeOfDay : Text;
  };

  type ImagePrompt = {
    topText : Text;
    bottomText : Text;
    imagePrompt : Text;
  };

  type PinterestPinContent = {
    titles : [Title];
    descriptions : [Description];
    hashtags : [[Hashtag]];
    imagePrompts : [ImagePrompt];
    timeRecommendations : [TimeRecommendation];
    originalUrl : Text;
  };

  module PinterestPinContent {
    public func compare(content1 : PinterestPinContent, content2 : PinterestPinContent) : Order.Order {
      Text.compare(content1.originalUrl, content2.originalUrl);
    };
  };

  let contents = Map.empty<Text, PinterestPinContent>();

  func storeRecentContent(newContent : PinterestPinContent) {
    // Limit to last 10
    if (contents.size() >= 10) {
      let sortedEntries = contents.toArray();
      if (sortedEntries.size() > 0) {
        contents.remove(sortedEntries[0].0);
      };
    };
    contents.add(newContent.originalUrl, newContent);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func generatePins(blogUrl : Text) : async PinterestPinContent {
    // Fetch blog content
    let response = await OutCall.httpGetRequest(blogUrl, [], transform);

    // Parse HTML and extract data (this is a stub, actual parsing happens in frontend/TS)
    if (response.size() == 0) {
      Runtime.trap("Failed to fetch blog content");
    };

    // Simulated dummy content based on extracted data
    let content : PinterestPinContent = {
      titles = [ "Sample Title 1", "Sample Title 2" ];
      descriptions = [ "Optimized description 1, 2, and 3 with semantic keywords." ];
      hashtags = [ [ "#pinterest", "#marketing" ], [ "#seo", "#trend" ] ];
      imagePrompts = [
        {
          topText = "Boost Your Traffic";
          bottomText = "Read the Full Guide";
          imagePrompt = "Flat lay of laptop, coffee, Pinterest logo";
        },
        {
          topText = "Pinterest Strategies";
          bottomText = "Learn More Now";
          imagePrompt = "Animated infographic style, Marketing tips";
        },
      ];
      timeRecommendations = [
        { time = "08:00 PM"; region = "US EST"; typeOfDay = "Evening" },
        { time = "06:30 PM"; region = "UK"; typeOfDay = "Evening" },
      ];
      originalUrl = blogUrl;
    };

    // Store content and return
    storeRecentContent(content);
    content;
  };

  public query func getAllGeneratedPins() : async [PinterestPinContent] {
    contents.values().toArray().sort();
  };

  public query func getGeneratedPinsByUrl(url : Text) : async PinterestPinContent {
    switch (contents.get(url)) {
      case (?content) { content };
      case (null) { Runtime.trap("No content found for this URL") };
    };
  };
};
