import React from 'react'
import "./Try.css"

export const Try = () => {
    // Trigger event on tab click
    document.querySelectorAll('[dd-sidebar-tab]').forEach(function (element) {
        element.addEventListener('click', function () {
            var activeTab = this.getAttribute('dd-active-tab');
            var height = this.offsetHeight;

            document.querySelector('.sidebar-list-menu-active-bar').style.marginTop = (activeTab - 1) * height + 'px';
            document.querySelector('.sidebar-content').style.background = this.getAttribute('dd-sidebar-tab');
            document.querySelectorAll('.sidebar-list-menu li a').forEach(function (item) {
                item.classList.remove('active');
            });
            this.classList.add('active');
            var scrollElement = document.querySelector("#content_" + activeTab);
            var scrollOffsetTop = scrollElement.offsetTop;

            window.scrollTo({
                top: scrollOffsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Scroll event
    window.addEventListener('scroll', function () {
        var scrollPos = window.pageYOffset;
        var links = document.querySelectorAll('.sidebar-list-menu li a');

        links.forEach(function (link) {
            var currLink = link;
            var refElement = document.querySelector(currLink.getAttribute('href'));

            if (refElement.offsetTop <= scrollPos && refElement.offsetTop + refElement.offsetHeight > scrollPos) {
                links.forEach(function (item) {
                    item.classList.remove('active');
                });
                currLink.classList.add('active');
                var height = currLink.offsetHeight;
                document.querySelector('.sidebar-list-menu-active-bar').style.marginTop = (currLink.getAttribute('dd-active-tab') - 1) * height + 'px';
                document.querySelector('.sidebar-content').style.background = currLink.getAttribute('dd-sidebar-tab');
            }
        });
    });

    return (
        <div><div class="dd-wrapper">
            <div class="sidebar">
                <div class="sidebar-content">
                    <div class="sidebar-list">
                        <ul class="sidebar-list-menu">
                            <span class="sidebar-list-menu-active-bar"></span>
                            <li><a href="#content_1" class="active" dd-active-tab="1" dd-sidebar-tab="#ff4081">Pink</a></li>
                            <li><a href="#content_2" dd-active-tab="2" dd-sidebar-tab="#ff9800">Orange</a></li>
                            <li><a href="#content_3" dd-active-tab="3" dd-sidebar-tab="#9b26af">Purple</a></li>
                            <li><a href="#content_4" dd-active-tab="4" dd-sidebar-tab="#3f5ab5">Blue</a></li>
                            <li><a href="#content_5" dd-active-tab="5" dd-sidebar-tab="#008081">Teal</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="content">
                <div id="content_1" class="content-container">
                    <div class="content--center">
                        <span class="title-lite">#slide 1</span>
                        <h2 class="title">Content - slide 1</h2>
                    </div>
                </div>
                <div id="content_2" class="content-container">
                    <div class="content--center">
                        <span class="title-lite">#slide 2</span>
                        <h2 class="title">Content - slide 2</h2>
                    </div>
                </div>
                <div id="content_3" class="content-container">
                    <div class="content--center">
                        <span class="title-lite">#slide 3</span>
                        <h2 class="title">Content - slide 3</h2>
                    </div>
                </div>
                <div id="content_4" class="content-container">
                    <div class="content--center">
                        <span class="title-lite">#slide 1</span>
                        <h2 class="title">Content - slide 4</h2>
                    </div>
                </div>
                <div id="content_5" class="content-container">
                    <div class="content--center">
                        <span class="title-lite">#slide 5</span>
                        <h2 class="title">Content - slide 5</h2>
                    </div>
                </div>
            </div>
        </div></div>
    )
}
