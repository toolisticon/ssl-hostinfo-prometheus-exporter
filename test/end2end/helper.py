
def is_successful(r):
    # reqeusts built-in exception handler. Is None if okay
    r.raise_for_status()
    # additional response validation:
    try:
        assert r.headers['content-type'] == "application/json", \
            "Reponse is not JSON format (%s)" % r.headers.get('content-type','UNKNOWN')
    except AssertionError as e:
        print(e)
        return False
    else:
        return True
