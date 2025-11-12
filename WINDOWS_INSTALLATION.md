# Installing on iPhone from Windows (No Mac Required)

## Quick Start Guide

Since you don't have a Mac, **Expo Go** is your best option. It's free, easy, and works perfectly!

## Step-by-Step Instructions

### 1. Install Node.js on Windows

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the Windows installer (LTS version)
3. Run the installer and follow the prompts
4. Restart your computer if prompted

### 2. Install the App Dependencies

1. Open **Command Prompt** or **PowerShell** on Windows
2. Navigate to the project folder:
   ```bash
   cd C:\Users\T14\Desktop\fives_league_app\soccer_school_application
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   (This may take a few minutes)

### 3. Start the Development Server

In the same terminal, run:
```bash
npm start
```

You should see:
- A QR code in the terminal
- A message saying "Metro waiting on..."
- A URL like `exp://192.168.x.x:8081`

### 4. Install Expo Go on Your iPhone

1. Open the **App Store** on your iPhone
2. Search for **"Expo Go"**
3. Tap **Get** or **Install** (it's free)
4. Wait for it to install

### 5. Connect Your iPhone

**Important:** Your iPhone and Windows computer must be on the **same Wi-Fi network**.

1. Make sure both devices are connected to the same Wi-Fi
2. Open the **Expo Go** app on your iPhone
3. You'll see options to scan a QR code

### 6. Load the App

**Method 1: Using Expo Go App**
1. Open Expo Go on your iPhone
2. Tap **"Scan QR Code"**
3. Point your camera at the QR code in your Windows terminal
4. The app will start loading

**Method 2: Using iPhone Camera**
1. Open the **Camera** app on your iPhone
2. Point it at the QR code in your terminal
3. Tap the notification that appears
4. It will open in Expo Go

### 7. First Launch

- The first time, it may take 30-60 seconds to download and load
- You'll see a loading screen
- Then the PIN screen will appear
- **Default PIN: 2005**

## Troubleshooting

### "Unable to connect" or "Network request failed"

**Solution:**
1. Make sure both devices are on the same Wi-Fi
2. Check Windows Firewall - it might be blocking the connection
3. Try disabling Windows Firewall temporarily to test
4. Or allow Node.js through Windows Firewall

### QR Code doesn't work

**Solution:**
1. In the terminal, you'll see a URL like `exp://192.168.1.100:8081`
2. Open Expo Go on your iPhone
3. Tap "Enter URL manually"
4. Type the URL from the terminal

### App is slow or crashes

**Solution:**
1. Close other apps on your iPhone
2. Make sure you have a good Wi-Fi connection
3. Restart the development server: Press `Ctrl+C` in terminal, then run `npm start` again

### Can't see the QR code in terminal

**Solution:**
1. Make your terminal window larger
2. Or look for the URL/connection string in the terminal
3. You can manually enter the connection URL in Expo Go

## Using the App

- **All your data is saved locally on your iPhone**
- The app works exactly like a normal app
- You can close Expo Go and reopen it - your data will still be there
- To update the app, just scan the QR code again

## Building a Standalone App (Advanced)

If you want a standalone app (not in Expo Go), you can use Expo's cloud build service:

1. Install EAS CLI: `npm install -g eas-cli`
2. Create free Expo account: `eas login`
3. Build: `eas build --platform ios`

**Note:** You'll need an Apple Developer account ($99/year) to install standalone apps on your iPhone.

## Need Help?

- Check the main `INSTALLATION.md` file
- Expo documentation: [docs.expo.dev](https://docs.expo.dev)
- Make sure Node.js is installed: `node --version` in terminal

