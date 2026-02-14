import Text "mo:core/Text";



actor {
  var published = false;
  var subdomain : ?Text = null;
  var domain : ?Text = null;

  public shared ({ caller }) func publish(pSubdomain : Text) : async () {
    published := true;
    subdomain := ?pSubdomain;
  };

  public shared ({ caller }) func unpublish() : async () {
    published := false;
  };

  public query ({ caller }) func isPublished() : async Bool {
    published;
  };

  public shared ({ caller }) func configureDomain(pDomain : Text) : async () {
    domain := ?pDomain;
  };

  public query ({ caller }) func getDomain() : async ?Text {
    domain;
  };

  public query ({ caller }) func getSubdomain() : async ?Text {
    subdomain;
  };

  public shared ({ caller }) func resetSiteStorage() : async () {
    published := false;
    subdomain := null;
    domain := null;
  };
};
