const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
require('dotenv').config();

const app = express();

// Passport setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Discord OAuth2 strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'guilds'],
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }
  )
);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'supersecretkey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', { user: req.user });
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/error', (req, res) => {
  res.render('error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

