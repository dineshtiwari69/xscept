from fastapi import APIRouter, Query
from typing import Optional, List
from tinydb import TinyDB, Query as TinyQuery
from pathlib import Path
import os

logs_router = APIRouter(tags=["Logs Router"])

# Reuse DB path
appdata_local = Path(os.getenv('LOCALAPPDATA'))
log_dir = appdata_local / "com.xscept.app" / "logs"
db = TinyDB(log_dir / "flows.json")


@logs_router.get("/logs")
def query_logs(
    url_contains: Optional[str] = Query(None),
    status_codes: Optional[List[int]] = Query(None),
    content_type_contains: Optional[str] = Query(None)
):
    Flow = TinyQuery()
    filters = []

    if url_contains:
        filters.append(Flow.url.test(lambda u: url_contains in u))

    if status_codes:
        filters.append(Flow.status_code.one_of(status_codes))

    if content_type_contains:
        filters.append(
            Flow.headers.test(lambda h: any(
                "content-type" in k.lower() and content_type_contains.lower() in v.lower()
                for k, v in h.items()
            ))
        )

    # Combine filters
    if filters:
        from functools import reduce
        from operator import and_
        results = db.search(reduce(and_, filters))
    else:
        results = db.all()

    # Remove "body" from response-type logs before returning
    for log in results:
        if log.get("type") == "response" and "body" in log:
            log["body"] = None

    return results
