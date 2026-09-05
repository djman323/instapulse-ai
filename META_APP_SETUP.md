# Meta Graph API & Instagram Graph API Setup Guide

This guide walks you through setting up your **Meta Developer App** to connect live Instagram Creator and Business accounts to **InstaPulse AI**.

---

## 1. Prerequisites
To access Instagram Graph API, you will need:
1. A **Facebook Personal Account** (used to log in to Meta for Developers).
2. An **Instagram Professional Account** (Business or Creator account). Personal profiles are not supported by the Meta Graph API.
3. A **Facebook Page** linked to your Instagram Professional Account:
   - On Instagram Mobile: *Settings & Privacy -> Creator / Business Tools -> Connect a Facebook Page*.

---

## 2. Create Your Meta Developer App
1. Go to [Meta for Developers](https://developers.facebook.com/) and log in.
2. Click **My Apps** in the top right, then click **Create App**.
3. Select **Other** as the use case, then choose **Business** as the app type.
4. Name your app (e.g. `InstaPulse AI Analytics`) and enter your contact email.
5. Click **Create App**.

---

## 3. Add Instagram & Facebook Login Products
1. In your App Dashboard, scroll to **Add products to your app**.
2. Find **Instagram Graph API** (or **Instagram**) and click **Set Up**.
3. Find **Facebook Login for Business** and click **Set Up**.
4. In the left sidebar under **Facebook Login** -> **Settings**:
   - Enable **Client OAuth Login**.
   - Enable **Web OAuth Login**.
   - Under **Valid OAuth Redirect URIs**, enter:
     - For local development: `http://localhost:3000/api/auth/meta/callback`
     - For production: `https://yourdomain.com/api/auth/meta/callback`
   - Click **Save Changes**.

---

## 4. Retrieve App Credentials & Update `.env.local`
1. In the left sidebar, navigate to **App Settings** -> **Basic**.
2. Copy your **App ID** and click **Show** to copy your **App Secret**.
3. In your project's `.env.local` file (or production environment variables), set:
   ```env
   META_APP_ID=your_actual_app_id_here
   META_APP_SECRET=your_actual_app_secret_here
   META_REDIRECT_URI=http://localhost:3000/api/auth/meta/callback
   ```

---

## 5. Required Permissions (Scopes)
InstaPulse AI requests the following official scopes during user OAuth:
- `instagram_basic`: Reads basic account info and media.
- `instagram_manage_insights`: Reads reach, impressions, saves, and engagement metrics.
- `pages_show_list`: Discovers Facebook Pages connected to the user's account.
- `pages_read_engagement`: Allows reading page connection state.
- `public_profile`: Basic Facebook identity verification.

---

## 6. Testing in Development Mode vs. Going Live

### Development Mode (Immediate Testing)
- While your app is in **Development Mode**, only users added as **Roles** (Administrators, Developers, or Testers) in your Meta App dashboard can log in.
- To test with your own account:
  1. Go to **App Roles** -> **Roles**.
  2. Add your Instagram/Facebook account as an Administrator or Tester.
  3. You can immediately log in and retrieve real live data!

### Production Mode (App Review for Public Creators)
- Before public creators without a tester role can log in, you must submit your app for **Meta App Review**:
  1. Complete **Business Verification** under **Business Settings**.
  2. Request `instagram_basic` and `instagram_manage_insights` with a 1-minute screencast showing how the dashboard uses the metrics.
  3. Toggle the app switch at the top of the dashboard from **In Development** to **Live**.

---

## 7. Sandbox / Instant Demo Mode
InstaPulse AI comes with an automatic **Sandbox Mode** pre-loaded with 4 realistic creator niches (Tech/AI, Fitness, Fashion, Food/Travel). If you want to demonstrate the platform to clients, buyers, or investors without logging into Facebook, simply launch with the **Instant Sandbox** button!
