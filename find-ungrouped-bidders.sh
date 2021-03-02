#!/bin/sh

# Helper script to find bidders that are not assigned to a list_group
find dev-docs/bidders -type f -name '*.md' | sort > _all-bidders.txt
find dev-docs/bidders -type f -name '*.md' -exec grep -Hn list_group {} \; | awk -F: '{print $1}' |sort > _grouped-bidders.txt
diff _all-bidders.txt _grouped-bidders.txt | grep '< ' | awk '{print $2}'
rm _all-bidders.txt _grouped-bidders.txt
