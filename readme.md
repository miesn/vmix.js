# vMix.js
A js class designed for remote control of vmix software.
***
## Usage
```
<script type="text/javascript" src="vmix.js"></script>
<script>
  var myvmix = new vmixJs();
  myvmix.vmixIp = "127.0.0.1";
</script>
```
### Agreement of Input Object.
every input object is defined as this way:
```
var input = {
  inputName: "",
  inputKey: "",
  inputTitle: "",
  duration: "",
  type: "",
  inputText: [{
    "index": "",
    "name": "",
    "content": ""
  }],
};
```
All of this value can find in vmix api xml info.
### Member Varibles
- vmixIp: use to access vmix api.
- vmixVersion: vmix version info from vmix api.
- inputList: A JSON Array. Include All inputs object.
- inputText: A JSON Array. Include All text inputs object(Xaml and GT).

### Method: refreshInput()
```
myvmix.refreshInput();
```
This method will get the input info from vmix api, and write to the member variables named **"inputList"** and **"inputText"**.
### Method: setText()
```
myvmix.setText(inputObject,fieldName,fieldContent);
```
> The query is based on input key, so ensure the input object contains the **inputKey** attributes.
You can use like this:
```
myvmix.setText(myvmix.inputList[0],"Message","HelloWorld");
myvmix.setText(myvmix.inputText[0],"Message","HelloWorld");
myvmix.setText(myvmix.inputText.filter((p) => {return JSON.parse(p).inputName == "LowerThird";}),"Name","Frank");
```
## Future Features
- Input Position
- Transition
- Title Clock and Countdown
- Media Play