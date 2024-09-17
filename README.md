# Massa Blockchain Links

This project provides an organized and user-friendly interface to explore various resources related to the Massa blockchain ecosystem. It features an HTML page displaying links to official Massa websites, wallets, market trackers, developer tools, and community projects.

## Features

- **Responsive Design**: A clean and minimal design for easy navigation across devices.
- **Categories**: Links are categorized for better accessibility (e.g., official websites, wallets, tools, community).
- **Dynamic Content**: Links are dynamically loaded from a JSON file, making it easy to add or update links without changing the HTML.

## Project Structure

- **index.html**: The main HTML page containing the structure and layout.
- **massa_links.json**: A JSON file that contains all the link data categorized into different sections.
- **CSS Styling**: Custom CSS for a light, pleasant visual theme with hover effects on link cards.

## How It Works

1. The HTML page fetches the content from `massa_links.json`.
2. Links are displayed in categories such as Massa websites, wallets, market trackers, and developer tools.
3. Each link is presented in a card format with an icon, title, and brief description.

## Getting Started

To run the project locally:

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/massa-links.git
    ```
2. Open `index.html` in your web browser:
    ```bash
    open index.html
    ```

## How to Add Links

To add more links to this project:

1. Open the `massa_links.json` file.
2. Add a new link entry under the appropriate category:
    ```json
    {
        "name": "New Link Name",
        "url": "https://newlink.com",
        "description": "Description of the new link.",
        "icon": "https://newlink.com/favicon.ico"
    }
    ```
3. Save the changes and refresh the `index.html` page.

## Contributions

Feel free to fork this repository, create a pull request, or submit issues for any bugs or feature requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
