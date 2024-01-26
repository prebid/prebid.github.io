FROM ruby:3.0

WORKDIR /usr/src/app

COPY Gemfile* ./

RUN bundle install

COPY . .

CMD JEKYLL_ENV=production bundle exec jekyll serve -H 0.0.0.0

EXPOSE 8080