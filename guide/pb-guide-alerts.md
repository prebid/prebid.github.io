---
layout: page_v2
sidebarType: -1
title: Prebid Website Documentation Guide | Alerts

---

# Prebid Style Guide | Alerts

{: .no_toc }

This page provides instructions on how to display alerts within prebid.org documentation.

- TOC
{:toc}

## Alerts

Alerts are callouts that provide emphasis, tips, important information or warnings. They are distinguished from regular text by being displayed in a colored box. There are four types of alerts that can be displayed on prebid.org:

- [Note](#note)
- [Tip](#tip)  
- [Important](#important)
- [Warning](#warning)

## Composing an alert

Alerts have two components, the content and the type.

### Creating alert content

Alert content is assigned to a Liquid variable by using the `capture` tag. This variable is then passed on to the alert HTML include file. In the example below we are 'capturing' the content between the opening and closing `capture` tags and assigining it to the `tipAlert` variable.

```text
{ % capture tipAlert % }
Follow the Prebid.org style guide to ensure all your documentation is consistent!
{ % endcapture % }
```

### Displaying an alert

To display an alert, use the Liquid `include` command to include one of the alert HTML files and pass the 'captured' content to it. The include files provide the HTML and CSS references to correctly format the alert. There are four include files:

- alert_note.html
- alert_tip.html
- alert_important.html
- alert_warning.html

In the example below we are including the tip alert, `alert_tip.html` and passing the value of `tipAlert` to the page's `content` variable.

```text
{ % include alerts/alert_tip.html content=tipAlert % }
```

In the `alert_tip.html` file the `content` variable is displayed by Liquid wrapping it in double braces.

```html
{ { content } }
```

The full HTML from the `alert_note.html` file:

```html
<div markdown="span" class="pb-alert pb-alert-important" role="alert"><i class="fa fa-exclamation-circle"></i> <b>Important:</b> {{include.content}}</div>
```

Using the examples above would render this alert:

{% capture tipAlert %}
Follow the Prebid.org style guide to ensure all your documentation is consistent!
{% endcapture %}

{% include alerts/alert_tip.html content=tipAlert %}

## Alert Types

### Note

A note presents important information in relation to the page topic. The content of the note is deemed important enough that it needs to be distinguished from the regular content on the page. Notes are displayed in a blue box.

*Example*

{% capture noteAlert %}
This is some very important information.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

### Tip

A tip provides a shortcut or more efficient way of performing a task or writing some code. Tips should not be used for general comments. For general comments or to give added emphasis use a note.

*Example*

{% capture tipAlert %}
A tip helps the user do something.
{% endcapture %}

{% include alerts/alert_tip.html content=tipAlert %}

### Important

Important alerts provide critical information to the user, such as to use caution when using an element in certain situations or that an API feature is scheduled to be deprecated and will not be available in future releases.

*Example*

{% capture importantAlert %}
An important alert provides crititcal information to the user.
{% endcapture %}

{% include alerts/alert_important.html content=importantAlert %}

*Example*

### Warning

Warning indicate when an action can cause dire results for the user. For example, if API endpoints have been deprecated a warning should appear in the API docs to warn the user their code could break if they use the deprecated endpoints.

{% capture warningAlert %}
A caution alert provides crititcal information to the user.
{% endcapture %}

{% include alerts/alert_warning.html content=warningAlert %}

## Streamlined alerts

If the alert to be presented requires only a small amount of text there is no need to use the Liquid `capture` command, the text can be passed directly to the content value of the include file.

For example, if you had content such as "The adpod unit is only available for long-form video." you could pass that line of text directly to the `content` variable.

```text
{ % include alerts/alert_note.html content="The adpod unit is only available for long-form video." % }
```

{% include alerts/alert_note.html content="The adpod unit is only available for long-form video." %}

Use the Liquid `capture` command when you are creating an alert that is very long or contains HTML formating.
