def is_subscriber_approved(subscriber: dict | None) -> bool:
    return subscriber is not None and (subscriber.get("isApproved", False) == True)
