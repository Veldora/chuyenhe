from flask import Flask, render_template,request

app = Flask(__name__)

@app.route('/')
def index2():
    return render_template('chuyenhe.html')

@app.route('/google71f185714e0c0e1a')
def index2():
    return render_template('google71f185714e0c0e1a.html')

if __name__ == '__main__':
  app.run(debug=True)
