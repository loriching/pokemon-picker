const APIForm = ({onSubmit}) => {

  return (
    <div>
      <h3>Generate random Pokémon to find out more about them, or select attributes to ban.</h3>
    
      <button type="submit" className="button" onClick={onSubmit}>Find a Pokémon!</button>
    </div>
  );
};

export default APIForm;