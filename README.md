# ml-images
ML classifier for handwritten characters, with an interactive web [https://ml-images.onrender.com](app).  

The classifier is a Convolutional Neural Network (CNN) which classifies handwritten characters (0-9, A-Z, a-z).  
Users can draw a character on the canvas and the model will attempt to predict which character it is.  

# Libraries
- Flask
- tensorflow
- numpy
- PIL
- pandas
- sklearn

# Dataset
Image set downloaded via Kaggle: [https://www.kaggle.com/datasets/dhruvildave/english-handwritten-characters-dataset](https://www.kaggle.com/datasets/dhruvildave/english-handwritten-characters-dataset)  
Includes 62 different characters (0-9, A-Z, a-z) with 55 samples from each class.  

# Method
## Preprocessing
Inputs are resized to 64x64, converted to grayscale, and normalized before training/prediction. I used an 80/20 train/test split.

## Model
The ML model uses a convolutional neural network consisting of three convolutional layers with 32, 64, and 128 filters, respectively. Each layer uses ReLU activation and subsequently 2x2 max pooling. The output is then flattened and passed through a fully connected layer with 128 ReLU neurons. A 30% dropout layer is used to reduce overfitting before the final softmax layer with 62 outputs corresponding to the 62 classes.  

## Evaluation
I compared the CNN model to a simple 1NN Euclidean distance classifier. I found that the 1NN classifier achieved roughly 41% accuracy on the test set while the CNN classifier achieved around 74% accuracy.  

## Improvements
I found that removing the dropout layer caused severe overfitting. It allowed the CNN to reach over 90% accuracy on the training set, but test accuracy dropped below 70%.   

## Conclusion
Although this is a very simple application of the CNN, it is interesting to see how well it performs.  
I wish I had a larger dataset to train my model. I am considering allowing user input to be used as additional training data.  
Another interesting idea to explore in the future is to train an ML model that can read a sequence of handwritten characters (names, words, sentences, etc).  

# References
de Campos, T. E., Babu, B. R., & Varma, M. (2009). *Character recognition in natural images*. Proceedings of the International Conference on Computer Vision Theory and Applications, Lisbon, Portugal.  
Convolutional Neural Network Tutorial via TensorFlow [https://www.tensorflow.org/tutorials/images/cnn](https://www.tensorflow.org/tutorials/images/cnn)  

# AI Disclaimer
I used ChatGPT as a learning and debugging aid during development. It was useful for brainstorming ideas, troubleshooting errors, and implementing the web demo. 