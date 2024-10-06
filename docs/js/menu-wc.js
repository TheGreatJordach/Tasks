'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">tasks documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppConfigModule.html" data-type="entity-link" >AppConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IamModule.html" data-type="entity-link" >IamModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' : 'data-bs-target="#xs-controllers-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' :
                                            'id="xs-controllers-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' }>
                                            <li class="link">
                                                <a href="controllers/AuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' : 'data-bs-target="#xs-injectables-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' :
                                        'id="xs-injectables-links-module-IamModule-9651bb222c92dd02474ee8e5e597945baf755b874b5e3844a86eb2fe696abfa0bb57eddf115329fa59babda227481f1c94e45ab328c0479d973f476488f75e16"' }>
                                        <li class="link">
                                            <a href="injectables/BcryptProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BcryptProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/IamService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IamService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtTokenProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtTokenProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PasswordService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasswordService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' : 'data-bs-target="#xs-controllers-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' :
                                            'id="xs-controllers-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' }>
                                            <li class="link">
                                                <a href="controllers/TaskController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' : 'data-bs-target="#xs-injectables-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' :
                                        'id="xs-injectables-links-module-TasksModule-1e9dd57cbef692884d3644c9ecb660e788cfe075fac75ebeb63bc004e5630b641b8e847993fa400f4427c3072d33dbf037d7f16311d27130977128268d55ccc0"' }>
                                        <li class="link">
                                            <a href="injectables/TaskService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-b504fc65b6a1cbe9c303c9e1d5b548307ae2e6d7bd23e65c3f44e1909bc85dfeb043b906a9f4693eecc0d2314676bebbe90fa1185f988b35dfef93f5a8e676a2"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-b504fc65b6a1cbe9c303c9e1d5b548307ae2e6d7bd23e65c3f44e1909bc85dfeb043b906a9f4693eecc0d2314676bebbe90fa1185f988b35dfef93f5a8e676a2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-b504fc65b6a1cbe9c303c9e1d5b548307ae2e6d7bd23e65c3f44e1909bc85dfeb043b906a9f4693eecc0d2314676bebbe90fa1185f988b35dfef93f5a8e676a2"' :
                                        'id="xs-injectables-links-module-UsersModule-b504fc65b6a1cbe9c303c9e1d5b548307ae2e6d7bd23e65c3f44e1909bc85dfeb043b906a9f4693eecc0d2314676bebbe90fa1185f988b35dfef93f5a8e676a2"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthenticationController.html" data-type="entity-link" >AuthenticationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TaskController.html" data-type="entity-link" >TaskController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Task.html" data-type="entity-link" >Task</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BaseTodoDto.html" data-type="entity-link" >BaseTodoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseUserDto.html" data-type="entity-link" >BaseUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTodoDto.html" data-type="entity-link" >CreateTodoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdDto.html" data-type="entity-link" >IdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogInDto.html" data-type="entity-link" >LogInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationDto.html" data-type="entity-link" >PaginationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationResultDto.html" data-type="entity-link" >PaginationResultDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTaskDto.html" data-type="entity-link" >UpdateTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateEnv.html" data-type="entity-link" >ValidateEnv</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BcryptProvider.html" data-type="entity-link" >BcryptProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IamService.html" data-type="entity-link" >IamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtTokenProvider.html" data-type="entity-link" >JwtTokenProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordService.html" data-type="entity-link" >PasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskService.html" data-type="entity-link" >TaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link" >AuthenticationGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AuthUserData.html" data-type="entity-link" >AuthUserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HashAlgoInterface.html" data-type="entity-link" >HashAlgoInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});