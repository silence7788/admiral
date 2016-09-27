/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

import HostPickerVue from 'HostPickerVue';
import DropdownSearchMenu from 'components/common/DropdownSearchMenu';
import utils from 'core/utils';
import services from 'core/services';

const HOST_RESULT_LIMIT = 10;

function hostSearchCallback(q, callback) {
  services.searchHosts(q, HOST_RESULT_LIMIT).then((results) => {
    results = results.map((host) => {
      host.name = utils.getHostName(host);
      return host;
    });

    callback(results);
  });
}

var HostPicker = Vue.extend({
  template: HostPickerVue,
  props: {
    viewHosts: {
      required: false,
      type: Object
    }
  },
  methods: {
    getHosts: function() {
      var hosts = [];

      var hostSearchComps = this.$children;
      for (var i = 0; i < hostSearchComps.length; i++) {
        var hostSearchComp = hostSearchComps[i];
        if (hostSearchComp.getHost) {
          var host = hostSearchComp.getHost();
          if (host) {
            hosts.push(host);
          }
        }
      }
      return hosts;
    },
    addHost: function() {
      this.viewHosts.push({
        viewId: utils.uuid()
      });
    },
    removeHost: function(uuid) {
      if (this.viewHosts.length > 1) {
        this.viewHosts = this.viewHosts.filter(vh => vh.viewId !== uuid);
      }
    }
  },
  attached: function() {
    this.viewHosts = [{
      viewId: utils.uuid()
    }];
  },
  detached: function() {
  },
  components: {
    hostSearch: {
      template: '<div></div>',
      attached: function() {
        this.hostInput = new DropdownSearchMenu($(this.$el), {
          title: i18n.t('dropdownSearchMenu.title', {
            entity: i18n.t('app.host.entity')
          }),
          searchPlaceholder: i18n.t('app.template.details.editNetwork.hostsSearchPlaceholder')
        });
        this.hostInput.setFilterCallback(hostSearchCallback);
      },
      methods: {
        getHost: function() {
          return this.hostInput.getSelectedOption();
        }
      }
    }
  }
});

export default HostPicker;