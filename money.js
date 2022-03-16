func dump(ctx *cli.Context) error {
	stack, _ := makeConfigNode(ctx)
	defer stack.Close()

	conf, db, root, err := parseDumpConfig(ctx, stack)
	if err != nil {
		return err
	}
	state, err := state.New(root, state.NewDatabase(db), nil)
	if err != nil {
		return err
	}
	if ctx.Bool(utils.IterativeOutputFlag.Name) {
		state.IterativeDump(conf, json.NewEncoder(os.Stdout))
	} else {
		if conf.OnlyWithAddresses {
			fmt.Fprintf(os.Stderr, "If you want to include accounts with missing preimages, you need iterative output, since"+
				" otherwise the accounts will overwrite each other in the resulting mapping.")
			return fmt.Errorf("incompatible options")
		}
		fmt.Println(string(state.Dump(conf)))
	}
	return nil
}
