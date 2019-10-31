# ScaledHome MQTT Architecture
This repo has been written to document what has been done during my internship period at University of Central Florida (Orlando, FL) in terms of architecture design and distributed system techniques in order to make the ScaledHome project available remotely via a MQTT server broker.

![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/logo.png?raw=true)


**Table of Contents**

[TOCM]

[TOC]

#What
##ScaledHome project
ScaledHome is a physical scale model of a suburban home.
The plan is to model the environment (weather, sunshine), the physical properties of the home, the heating/cooling balance of the interior of the home, as well as energy generation (solar panels) and storage capabilities.

![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/structure.jpg?raw=true)

The house is composed by:
- 6 rooms of different sizes
- 8 windows
- 7 doors
- 7 sensors for temperature and moisture
- 1 external fan to decrease the outside temperature
- 1 external lamp to increase the outside temperature
##Structure
ScaledHome is controlled and managed by two Raspberry Pi 3; one controls the windows and doors motors while the other one controls the fan, the lamp and the temperature and humidity sensors.

![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/Architecture%20ScaledHome%200.png?raw=true)

##Mqtt
MQTT[2] (MQ Telemetry Transport) is an open OASIS and ISO standard (ISO/IEC PRF 20922)[3] lightweight, publish-subscribe network protocol that transports messages between devices. The protocol usually runs over TCP/IP; however, any network protocol that provides ordered, lossless, bi-directional connections can support MQTT.[4] It is designed for connections with remote locations where a "small code footprint" is required or the network bandwidth is limited.
###Mqtt Broker
Broker acts as a post office, MQTT doesn’t use the address of the intended recipient but uses the subject line called “Topic”, and anyone who want a copy of that message will subscribes to that topic. Multiple clients can receive the message from a single broker (one to many capability). Similar, multiple publisher can publish topics to a single subscriber (many to one).
Each client can both produce and subscribe the date by both publishing and subscribing, i.e. the devices can publish sensor data and still be able to receive the configuration information or control commands (MQQT is bidirectional communication protocol). This helps in both sharing data, managing and controlling devices.
#Why
One of the main goals of the project is to make available ScaledHome from outside via an internet protocol in order to improve the quantity and the quality of data collected by the model and so achive better predictive capabilities.
##Requirements
The two Raspberry Pi have to interact each other with a lightweight and fast protocol because the goal is to provide to them a scenario (a file) that contains all the instruction they have to perform. In this way a greated decoupling has been guaranteed and also it enables the simulation of several habits of the ScaledHome's inhabitants.

##Solutions
In order to make the two controllers cooperating each other several options has been evaluated, here two of them has been listed and compared in order to find the best one:
- REST interaction: the first idea was to place on the actuator controller a WebServer capable of receiving instructions and execute them and then replying with the status of the actuators system.
- Pub/Sub interaction: the second one was to avoid a direct interaction between the two controllers and to place a rendezvous point between the two, such as a Pub/Sub Broker entity. This broker also has to communicate with another entity, that has been called “Home Controller”, which plays a tougher role in terms of responsibilities and computation than the other two controller.

The first solution has the great advantage of being simpler that the other one, in fact the number of entities involved is lower and their interaction is based on a http connection which is very well compatible with an heterogeneous set of other technologies.
But on the other hand the introduction of a rendezvous point guarantees a greater decoupling in time and space, and doing this way the two controllers have just to perform instructions and collect the data while the business logic and the coordination of the system is dedicated to the entity with the better computational capabilities.
Furthermore the Home Controller can be used from the outside to collect data and run simulations via a Web Server interface.
In addition the Home Controller can serve as the bridge between the Machine Learning engine and the set of simpler and less smart devices close to the house.

- REST solution
![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/Architecture%20ScaledHome%201.png?raw=true)

- PubSub solution
![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/Architecture%20ScaledHome%202.png?raw=true)
##Choosen architecture
Overall the second architecture appears more scalable because the simpler devices close to the house have just to perform instructions and collect data while the Home Controller manages the interaction with the outside components which are more capable in terms of computation. 
Also the second architecture provides a better defined partitioning of roles inside the system because each component has a specific duty to perform.
	The second solution suggest a splitting of components into two different sets:
	- The local components set: it is composed by all the actuators and the sensors and their controllers.
	- The remote componets set: it is composed by one or more Home Controller and by the Machine Learning engine.

#How
Mqtt is a lightweight standard that implements the PubSub interaction and it has been choosen as the right technology because it is quite well spread, so there are Open Source projects that provides interfaces for different languages and also there are several Cloud brokers that can be used for free if your application requires a limited number of clients.

##Mqtt Broker: CloudMqtt
CloudMqtt is one of the more used cloud Mqtt Brokers among the IoT community, you can create easily a free account that will provide you a Mqtt Broker able to manage up to 5 clients and an unlimited number of topics.
You can set usernames and passwords to secure your topics and connect to them from clients written in different languages.
**CloudMqtt web site: **[https://www.cloudmqtt.com/](https://www.cloudmqtt.com/ "https://www.cloudmqtt.com/")

##Mqtt Clients
Once you have successfully created you CloudMqtt account and appropriately set the topics and the clients credentials you can subscribe and publish to the topic from different clients. The only requirements is to limit their cardinality up to 5.

In order to maintain the previous work done by the Professor Turgut's team it has been decided to keep python as the only language on the two Raspberry Pi, in fact has been possibile to reuse some code in order to perform the scenario's actions on the two local controllers. While the home controller client has been coded with Nodejs because it is more suitable for a WebServer interface from the outside.

##Headers (Underline)

H1 Header (Underline)
=============

H2 Header (Underline)
-------------

###Characters
                
----

~~Strikethrough~~ <s>Strikethrough (when enable html tag decode.)</s>
*Italic*      _Italic_
**Emphasis**  __Emphasis__
***Emphasis Italic*** ___Emphasis Italic___

Superscript: X<sub>2</sub>，Subscript: O<sup>2</sup>

**Abbreviation(link HTML abbr tag)**

The <abbr title="Hyper Text Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

###Blockquotes

> Blockquotes

Paragraphs and Line Breaks
                    
> "Blockquotes Blockquotes", [Link](http://localhost/)。

###Links

[Links](http://localhost/)

[Links with title](http://localhost/ "link title")

`<link>` : <https://github.com>

[Reference link][id/name] 

[id/name]: http://link-url/

GFM a-tail link @pandao

###Code Blocks (multi-language) & highlighting

####Inline code

`$ npm install marked`

####Code Blocks (Indented style)

Indented 4 spaces, like `<pre>` (Preformatted Text).

    <?php
        echo "Hello world!";
    ?>
    
Code Blocks (Preformatted text):

    | First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |

####Javascript　

```javascript
function test(){
	console.log("Hello world!");
}
 
(function(){
    var box = function(){
        return box.fn.init();
    };

    box.prototype = box.fn = {
        init : function(){
            console.log('box.init()');

			return this;
        },

		add : function(str){
			alert("add", str);

			return this;
		},

		remove : function(str){
			alert("remove", str);

			return this;
		}
    };
    
    box.fn.init.prototype = box.fn;
    
    window.box =box;
})();

var testBox = box();
testBox.add("jQuery").remove("jQuery");
```

####HTML code

```html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <title>Hello world!</title>
    </head>
    <body>
        <h1>Hello world!</h1>
    </body>
</html>
```

###Images

Image:

![](https://pandao.github.io/editor.md/examples/images/4.jpg)

> Follow your heart.

![](https://pandao.github.io/editor.md/examples/images/8.jpg)

> 图为：厦门白城沙滩 Xiamen

图片加链接 (Image + Link)：

[![](https://pandao.github.io/editor.md/examples/images/7.jpg)](https://pandao.github.io/editor.md/examples/images/7.jpg "李健首张专辑《似水流年》封面")

> 图为：李健首张专辑《似水流年》封面
                
----

###Lists

####Unordered list (-)

- Item A
- Item B
- Item C
     
####Unordered list (*)

* Item A
* Item B
* Item C

####Unordered list (plus sign and nested)
                
+ Item A
+ Item B
    + Item B 1
    + Item B 2
    + Item B 3
+ Item C
    * Item C 1
    * Item C 2
    * Item C 3

####Ordered list
                
1. Item A
2. Item B
3. Item C
                
----
                    
###Tables
                    
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell 

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

| Function name | Description                    |
| ------------- | ------------------------------ |
| `help()`      | Display the help window.       |
| `destroy()`   | **Destroy your computer!**     |

| Item      | Value |
| --------- | -----:|
| Computer  | $1600 |
| Phone     |   $12 |
| Pipe      |    $1 |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
                
----

####HTML entities

&copy; &  &uml; &trade; &iexcl; &pound;
&amp; &lt; &gt; &yen; &euro; &reg; &plusmn; &para; &sect; &brvbar; &macr; &laquo; &middot; 

X&sup2; Y&sup3; &frac34; &frac14;  &times;  &divide;   &raquo;

18&ordm;C  &quot;  &apos;

##Escaping for Special Characters

\*literal asterisks\*

##Markdown extras

###GFM task list

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
    - [ ] GFM task list 3-1
    - [ ] GFM task list 3-2
    - [ ] GFM task list 3-3
- [ ] GFM task list 4
    - [ ] GFM task list 4-1
    - [ ] GFM task list 4-2

###Emoji mixed :smiley:

> Blockquotes :star:

####GFM task lists & Emoji & fontAwesome icon emoji & editormd logo emoji :editormd-logo-5x:

- [x] :smiley: @mentions, :smiley: #refs, [links](), **formatting**, and <del>tags</del> supported :editormd-logo:;
- [x] list syntax required (any unordered or ordered list supported) :editormd-logo-3x:;
- [x] [ ] :smiley: this is a complete item :smiley:;
- [ ] []this is an incomplete item [test link](#) :fa-star: @pandao; 
- [ ] [ ]this is an incomplete item :fa-star: :fa-gear:;
    - [ ] :smiley: this is an incomplete item [test link](#) :fa-star: :fa-gear:;
    - [ ] :smiley: this is  :fa-star: :fa-gear: an incomplete item [test link](#);
            
###TeX(LaTeX)
   
$$E=mc^2$$

Inline $$E=mc^2$$ Inline，Inline $$E=mc^2$$ Inline。

$$\(\sqrt{3x-1}+(1+x)^2\)$$
                    
$$\sin(\alpha)^{\theta}=\sum_{i=0}^{n}(x^i + \cos(f))$$
                
###FlowChart

```flow
st=>start: Login
op=>operation: Login operation
cond=>condition: Successful Yes or No?
e=>end: To admin

st->op->cond
cond(yes)->e
cond(no)->op
```

###Sequence Diagram
                    
```seq
Andrew->China: Says Hello 
Note right of China: China thinks\nabout it 
China-->Andrew: How are you? 
Andrew->>China: I am good thanks!
```

###End