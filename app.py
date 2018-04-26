from flask import Flask, render_template,request

app = Flask(__name__)

@app.route('/')
def index2():
    return render_template('chuyenhe.html')

if __name__ == '__main__':
  app.run(debug=True)
