from flask import Flask, render_template
app = Flask(__name__) #this has 2 underscores on each side

@app.route("/")
def hello_world():
   return render_template("index.html")

@app.route("/results/<int:level>")
def results(level=0):
   return render_template("results.html", level=level)
