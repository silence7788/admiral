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

package cmd

import (
	"admiral/events"

	"github.com/spf13/cobra"
)

func init() {
	eventCmd.Flags().BoolVar(&clearAll, "clear", false, clearAllEventsDesc)
	RootCmd.AddCommand(eventCmd)
}

var eventCmd = &cobra.Command{
	Use:   "events",
	Short: "Prints events log.",
	Long:  "Prints events log.",

	Run: func(cmd *cobra.Command, args []string) {
		output, err := RunEvents()
		formatAndPrintOutput(output, err)
	},
}

func RunEvents() (string, error) {
	el := events.EventList{}
	_, err := el.FetchEvents()
	if clearAll {
		el.ClearAllEvent()
		return "Events cleared", err
	}
	if err != nil {
		return "", err
	}
	return el.GetOutputString(), nil
}
