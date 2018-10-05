#!/bin/bash
set -e

node briefmenow_exams.js | jq -r '.[] | .href + "\t" + .text' | while IFS=$'\t' read -r -a line; do
   href=${line[0]} && tag="briefmenow "${line[1]}
   echo $tag
#   node briefmenow_question_urls.js --exam-url $href  | jq -r '.' > "portions/$tag.json"
   node briefmenow_question_urls.js --exam-url $href  | jq -r --arg value "$tag" '[.[] | . + {"tag" : $value}]' > "portions/$tag.json"
   echo $tag" - done"
   cat "portions/$tag.json" | jq -r '.[] | .href + "\t" + .text' | while IFS=$'\t' read -r -a line; do
      href=${line[0]} && text=${line[1]}
      content=$(node briefmenow_question_data.js --question-url $href --tag "$tag" | jq -c '.')   
      filename=$(echo $content | node sha-512.js)
      echo $content > "questions/"$filename".json"
      echo $filename".json"
   done
done


 