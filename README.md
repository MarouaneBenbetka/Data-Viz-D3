## Solution

The solution we have implemented in this [website](https://marouanebenbetka.github.io/Data-Viz-D3/) involves representing variables through interactive buttons, which can be paginated, making it scalable for a vast number of variables.

For each variable, we have incorporated a **stacked bar chart** illustrating the relationships between the selected variable's categories and diseases on one side. On the other side, a **frequency polygon** depicts the connection between the chosen disease and all represented variables. Both visualizations are equipped with interactive elements, enhancing user experience and comprehension. This design not only accommodates a large dataset but also provides a dynamic and insightful exploration of the intricate relationships within the chronic disease evaluation data.

## Visual encoding 

Visualization encompasses three stages of perception: parallel processing for basic features, active pattern perception, and the reduction to retained objects in visual memory, all intricately linked with issues of perception and cognition, based that we tried to design this website to be easily interpreted.
This approach works with multiple charts, which makes it generalizable.

#### Color Codes and Explanations for Different Medical Conditions

| Medical Condition   | Hex Color | Explanation |
|---------------------|-----------|-------------|
| Hypertension (HTA)  | `#FF5733` | This shade of orange symbolizes warmth and caution, conveying the need for awareness and management of blood pressure. |
| Asthma              | `#66CCCC` | A light blue-green color representing calmness and open air, symbolizing hope for easy breathing and a sense of serenity. |
| Aucune Maladie      | `#99CC99` | A soft green color associated with health and well-being, symbolizing a state of good health and balance. |
| Autres              | `#9966CC` | Purple, a color of mystery and diversity, representing various conditions outside the mentioned categories. |
| Diabetes            | `#FF9933` | This orange shade represents warmth and vitality, symbolizing the need for careful management and attention for a balanced and healthy lifestyle in individuals with diabetes. |

## About D3.js

D3.js, or D3 (Data-Driven Documents), is a JavaScript library that enables data visualization by using web standards. It allows you to bind arbitrary data to a Document Object Model (DOM), and then apply data-driven transformations to the document. Here are some key features:

- **Dynamic, Interactive Visualizations:** D3 allows the creation of complex, interactive graphics that can respond to user interactions and dynamic data updates.
- **Use of Web Standards:** D3 employs widely-supported web standards like SVG, CSS, and HTML. This ensures compatibility across various web browsers and devices.
- **Data Binding:** One of D3's unique features is its ability to bind data to the DOM, enabling efficient manipulation of document elements based on data.
- **Customizable and Extensible:** D3 does not provide a rigid framework. Instead, it offers building blocks for users to create custom visualizations tailored to specific requirements.

In our project, D3.js plays a crucial role in enabling interactive data visualizations, making complex data more accessible and understandable to users.

## Data Cleaning

The `data-cleaning` folder contains the Jupyter notebook used for cleaning the `MNT.xlsx` data. This notebook includes all the preprocessing steps performed on the dataset to prepare it for analysis and visualization:

- **Data Inspection:** Identifying missing values, outliers, and inconsistencies in the dataset.
- **Data Transformation:** Converting data into suitable formats and creating derived variables when necessary.
- **Data Normalization:** Standardizing data ranges and scales for consistent analysis.
- **Missing Value Handling:** Imputing or removing missing values based on the nature of the data.
- **Feature Selection:** Choosing relevant features for the analysis to ensure data quality and relevance.

This notebook is essential for understanding the data preparation process and ensuring the integrity and accuracy of the visualizations presented in the project.
